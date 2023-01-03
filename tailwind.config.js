/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
	daisyui: {
		styled: true,
		themes: true,
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: "",
		themes: [
			{
			  business: {
				...require("daisyui/src/colors/themes")["[data-theme=business]"],
				accent: "#ffa500",
				"accent-focus": "#D18700"
			  },
			},
		  ],
		darkTheme: "business",
	}
}
