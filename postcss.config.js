module.exports = {
  plugins: {
    ...(process.env.SKIP_TAILWIND || !require.resolve('tailwindcss') ? {} : { tailwindcss: {} }),
    autoprefixer: {},
  },
}
