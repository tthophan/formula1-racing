import { Driver, RaceGrand, RaceResult } from 'src/modules/racing/entities';
import { TeamDrivers } from 'src/modules/racing/entities/team-driver.entity';
import { Team } from 'src/modules/racing/entities/team.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DOMParser = require('dom-parser');

export class CrawlData1686762502904 implements MigrationInterface {
  name = 'CrawlData1686762502904';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const domain = `https://www.formula1.com`;
    const commonUrl = `${domain}/en/results.html`;
    const grandUrl = `${commonUrl}/{year}/races.html`;

    const fetchWithTimeout = async (
      resource,
      options: { timeout?: number } = { timeout: 80000 },
    ) => {
      const { timeout = 80000 } = options;

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);

      return response;
    };

    const getTextContent = (element) => {
      return element.textContent.replace(/\n/g, '').trim();
    };

    const fetchRaceGrands = async (
      year,
    ): Promise<
      Array<{
        grandFrix: string;
        date: Date;
        winner: string;
        car: string;
        laps?: number;
        time: string;
        year: number;
        url: string;
      }>
    > => {
      const mapRowToRace = (row) => {
        const grandFrix = getTextContent(
          row.getElementsByTagName('td')[1].getElementsByTagName('a')[0],
        );
        const url =
          domain +
          row
            .getElementsByTagName('td')[1]
            .getElementsByTagName('a')[0]
            .getAttribute('href');

        const date = new Date(
          getTextContent(row.getElementsByTagName('td')[2]),
        );
        const winner = row
          .getElementsByTagName('td')[3]
          .getElementsByTagName('span')
          .map(getTextContent)
          .join(' ');
        const car = getTextContent(row.getElementsByTagName('td')[4]);
        const laps = Number(getTextContent(row.getElementsByTagName('td')[5]));
        const time = getTextContent(row.getElementsByTagName('td')[6]);
        return {
          grandFrix,
          date,
          winner,
          car,
          laps: Number.isNaN(laps) ? null : laps,
          time,
          year,
          url,
        };
      };

      const url = grandUrl.replace('{year}', year);

      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetchWithTimeout(url);
          const parser = new DOMParser();
          const html = await res.text();

          const doc = parser.parseFromString(html, 'text/html');

          // Get the table data
          const table = doc.getElementsByClassName('resultsarchive-table')[0];
          const tBody = table.getElementsByTagName('tbody')[0];
          const rows = Array.from(tBody.getElementsByTagName('tr'));
          resolve(rows.map(mapRowToRace));
        } catch (ex) {
          reject(ex);
        }
      });
    };

    const fetchRaces = async (
      url,
    ): Promise<
      Array<{
        position?: string;
        no: number;
        laps?: number;
        driverName: string;
        time: string;
        points: number;
        teamName: string;
      }>
    > => {
      const mapRowToRace = (row) => {
        const position = getTextContent(row.getElementsByTagName('td')[1]);
        const no = Number(getTextContent(row.getElementsByTagName('td')[2]));
        const driverName =
          getTextContent(
            row.getElementsByTagName('td')[3].getElementsByTagName('span')[0],
          ) +
          ' ' +
          getTextContent(
            row.getElementsByTagName('td')[3].getElementsByTagName('span')[1],
          );
        const laps = Number(getTextContent(row.getElementsByTagName('td')[5]));
        const time = getTextContent(
          row.getElementsByTagName('td')[
            row.getElementsByTagName('td').length - 3
          ],
        );
        const teamName = getTextContent(row.getElementsByTagName('td')[4]);
        const points = Number(
          getTextContent(
            row.getElementsByTagName('td')[
              row.getElementsByTagName('td').length - 2
            ],
          ),
        );
        return {
          position: position,
          no: no || Number.isNaN(no) ? null : no,
          laps: laps || Number.isNaN(laps) ? null : laps,
          driverName: driverName ?? 'N/A',
          time,
          points: points || Number.isNaN(points) ? null : points,
          teamName: teamName ?? 'NA',
        };
      };

      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetchWithTimeout(url);
          const parser = new DOMParser();
          const html = await res.text();

          const doc = parser.parseFromString(html, 'text/html');

          // Get the table data
          const table = doc.getElementsByClassName('resultsarchive-table')[0];
          const tBody = table.getElementsByTagName('tbody')[0];
          const rows = Array.from(tBody.getElementsByTagName('tr'));
          resolve(rows.map(mapRowToRace));
        } catch (ex) {
          console.error(
            `Crawl Race Results Exception`,
            url,
            JSON.stringify(ex),
          );
          reject(ex);
        }
      });
    };

    const fetchYears = (): Promise<Array<{ year: number }>> => {
      const url = commonUrl;
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetchWithTimeout(url);
          const parser = new DOMParser();
          const html = await res.text();
          const doc = parser.parseFromString(html, 'text/html');

          const selection = doc.getElementsByClassName(
            'resultsarchive-filter-form-select',
          )[0];
          const rows = Array.from(selection.getElementsByTagName('option'));

          resolve(
            rows.map((row) => ({
              year: Number(getTextContent(row)),
            })),
          );
        } catch (ex) {
          reject(ex);
        }
      });
    };

    const years = await fetchYears();
    let raceGrands = [];

    // Crawl Race Grands
    raceGrands = (
      await Promise.all(
        years.map(async ({ year }) => await fetchRaceGrands(year)),
      )
    ).flatMap((x) => x);

    // Create Race Grands
    const allRaceGrands = await queryRunner.manager
      .getRepository(RaceGrand)
      .save(
        raceGrands.map(({ laps, date, year, url, grandFrix }) => ({
          name: grandFrix,
          laps,
          date,
          year,
          url,
        })),
      );

    const cacheTeams: Record<string, Team> = {};
    const cacheDrivers: Record<string, Partial<Driver>> = {};
    const cacheTeamDrivers: Record<string, Partial<TeamDrivers>> = {};

    let exceptions = [];
    let datas = [];

    console.info(`Begin Craw Race Results: [${raceGrands.length}]`);
    let raceResults = (
      await Promise.all(
        allRaceGrands.flatMap(
          async ({
            url,
            year,
            id,
          }): Promise<
            Array<{
              position?: string;
              no: number;
              laps?: number;
              driverName: string;
              time: string;
              points: number;
              teamName: string;
              year: number;
              raceGrandId: number;
            }>
          > => {
            try {
              const rs = await fetchRaces(url);
              return [...rs.map((r) => ({ ...r, year, raceGrandId: id }))];
            } catch (ex) {
              exceptions = [...exceptions, { url, year, id }];
              return null;
            }
          },
        ),
      )
    )
      .flatMap((x) => x)
      .filter((x) => x);

    // Retry Crawl exceptions
    for (const { url, year, id } of [...exceptions]) {
      try {
        const rs = await fetchRaces(url);
        raceResults = [
          ...raceResults,
          ...rs.map((r) => ({ ...r, year, raceGrandId: id })),
        ];
        exceptions = exceptions.filter((x) => x.id !== id);
      } catch {
        continue;
      }
    }
    console.info('End Craw Race Results');

    // Create Drivers & Teams & TeamDrivers
    for (const raceResult of raceResults) {
      if (
        !cacheTeamDrivers[
          `${cacheDrivers[raceResult.driverName]?.id}${raceResult.year}`
        ]
      ) {
        const teamDriver = await queryRunner.manager
          .getRepository(TeamDrivers)
          .save({
            year: raceResult.year,
            driverId: cacheDrivers[raceResult.driverName]?.id,
            driver: {
              id: cacheDrivers[raceResult.driverName]?.id,
              name: raceResult.driverName,
              nationality: 'N/A',
              shortName: 'N/A',
            },
            teamId: cacheTeams[raceResult.teamName]?.id,
            team: {
              id: cacheTeams[raceResult.teamName]?.id,
              name: raceResult.teamName,
            },
          });
        cacheDrivers[raceResult.driverName] = teamDriver.driver;
        cacheTeams[raceResult.teamName] = teamDriver.team;
        cacheTeamDrivers[
          `${cacheDrivers[raceResult.driverName].id}${raceResult.year}`
        ] = teamDriver;
      }
      datas = [
        ...datas,
        {
          grandId: raceResult.raceGrandId,
          points: raceResult.points,
          time: raceResult.time,
          position: raceResult.position,
          year: raceResult.year,
          teamDriverId:
            cacheTeamDrivers[
              `${cacheDrivers[raceResult.driverName]?.id}${raceResult.year}`
            ]?.id,
          laps: raceResult.laps,
        },
      ];
    }

    // Create Race Results
    await queryRunner.manager
      .getRepository(RaceResult)
      .save([...datas.filter((d) => d && d.teamDriverId)]);
    console.info('Crawl done!!', `Exceptions:${exceptions.length}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(RaceResult).delete({});
    await queryRunner.manager.getRepository(TeamDrivers).delete({});
    await queryRunner.manager.getRepository(Team).delete({});
    await queryRunner.manager.getRepository(Driver).delete({});
    await queryRunner.manager.getRepository(RaceGrand).delete({});
  }
}
