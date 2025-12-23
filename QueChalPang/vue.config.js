const { defineConfig } = require('@vue/cli-service')
// const path = require('path')

const server = 'http://localhost:3000'

module.exports = defineConfig({
  transpileDependencies: true,
  // outputDir: path.resolve("../backend/public"),
  // 개발용 임시 서버
  devServer: {
    // Vue.js 실행 시 적용 PORT 변경
    port: 8080,
    // CORS(Cross Origin Resource Sharing) => proxy setting
    proxy: {
      // 해당 문자열로 시작하는 통신에 적용하는 설정
      '^/api': {
        // 변경할 Origin
        target: server,
        // Origin 변경 : http://localhost:8099 -> http://localhost:3000
        changeOrigin: true,
        // URL 중 일부분을 다시 작성 : /api/books -> /books
        //        pathRewrite: { "^/api": "/" },
        // websocket 설정 비활성화
        ws: false,
      },
    },
  },
})
