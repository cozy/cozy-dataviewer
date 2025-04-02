import { Q } from 'cozy-client'

export const buildDoctypesQuery = () => ({
  definition: Q('io.cozy.doctypes').limitBy(1000),
  options: {
    as: 'io.cozy.doctypes/allDoctypes'
  }
})
