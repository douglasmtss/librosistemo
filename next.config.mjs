/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'books.google.com',
                port: '',
                pathname: '/books/content?id=KYarDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api'
            }
        ]
    },

    webpack: config => {
        config.resolve.fallback = {
            fs: false,
            net: false,
            tls: false,
            child_process: false,
            events: false,
            util: false,
            stream: false,
            path: false
        }

        return config
    }
}

export default nextConfig
