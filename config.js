import { Constants } from 'expo';

const ENV = {
    dev: {
        apiUrl: 'ws://192.168.1.121:3000/websocket'
    },
    prod: {
        apiUrl: 'wss://app.naao.delivery/websocket'
    }
}

function getEnvVars(env = '') {
    if (env === null || env === undefined || env === '') return ENV.dev;
    // if (env === null || env === undefined || env === '') return ENV.prod;
    if (env.indexOf('dev') !== -1) return ENV.dev;
    if (env.indexOf('prod') !== -1) return ENV.prod;
}


export default getEnvVars(Constants.manifest.releaseChannel)