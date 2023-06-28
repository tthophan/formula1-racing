module.exports = {
    apps: [
      {
        name: "VR-VN",
        script: "./dist/src/main.js",
        instances: 2,
        exec_mode: "cluster",
        merge_logs: true,
        log_date_format: "YYYY-MM-DD HH:mm Z",
      }
    ]
  }
  
  