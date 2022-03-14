/** @type {import('gatsby').GatsbyConfig} */
module.exports = {
    siteMetadata: {
        title: `wh2o-web`,
        siteUrl: `https://wh2o.netlify.app/`
    },
    plugins: ['gatsby-plugin-netlify', 'gatsby-plugin-antd', {
        resolve: 'gatsby-plugin-google-analytics',
        options: {
            "trackingId": "UA-70972027-5"
        }
    }, "gatsby-plugin-image", "gatsby-plugin-react-helmet", "gatsby-plugin-sitemap", {
        resolve: 'gatsby-plugin-manifest',
        options: {
            "icon": "src/images/icon.png"
        }
    }, "gatsby-plugin-mdx", "gatsby-plugin-sharp", "gatsby-transformer-sharp", {
        resolve: 'gatsby-source-filesystem',
        options: {
            "name": "images",
            "path": "./src/images/"
        },
        __key: "images"
    }, {
        resolve: 'gatsby-source-filesystem',
        options: {
            "name": "pages",
            "path": "./src/pages/"
        },
        __key: "pages"
    },
    ]
};
