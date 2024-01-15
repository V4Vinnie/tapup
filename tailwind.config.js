// /** @type {import('tailwindcss').Config} */
const settings = {
    content: [
        './src/screens/**/*.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
        './src/providers/**/*.{js,jsx,ts,tsx}'
    ],
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                darkMode: true,
                dark: {
                    activeColor: "#ff197c",

                    //Background color
                    primaryBackground: "#15151e",
                    secondaryBackground: "#2b2b3b",

                    //Header color
                    headerBackground: "#66002c",
                    headerPrimaryColor: "#ff99c5",

                    //Text Input
                    inputBackground: "#3B3B43",
                    inputColor: "#ff99c5",

                    //Text
                    textColor: "#ffffff",
                    subTextColor: "#c3c3d0",

                    //Button
                    buttonBackground: "#66002c"
                },
                light: {
                    //Active/Inactive tint color
                    activeColor: "#ff197c",

                    //Background color
                    primaryBackground: "#ffffff",
                    secondaryBackground: "#F3F5F8",

                    //Header color
                    headerBackground: "#ffffff",
                    headerPrimaryColor: "#3B3B43",

                    //Text Input
                    inputBackground: "#ffffff",
                    inputColor: "#B2BCC8",

                    //Text
                    textColor: "#3B3B43",
                    headingSecondaryColor: "#FF4344",
                    subTextColor: "#697281",

                    //Button
                    buttonBackground: "#cc0058"
                },
                primaryColor: {
                    100: "#ff197c",
                    200: "#b3004e",
                },
                white: "#ffffff",
                gradientColor1: "#27a4ff",
                gradientColor2: "#3354ff",
                gradientColor3: "#f64abb",
                gradientColor4: "#ff7c33",
            },
        }
    },
};

module.exports = settings;