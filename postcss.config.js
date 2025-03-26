module.exports = {
  plugins: {
    ...(process.env.SKIP_TAILWIND ? {} : { tailwindcss: {} }),
    autoprefixer: {},
  },
}
