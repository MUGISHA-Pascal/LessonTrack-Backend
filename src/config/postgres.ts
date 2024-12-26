import { Sequelize } from "sequelize";

export const postgresConnectionSequelize = new Sequelize(
  "postgresql://pascal:IenF1K32h2MGYZr9xK8iTi7WlQH1JQMu@dpg-ctmlfilumphs73dggc80-a.oregon-postgres.render.com/project_database_o7ru",
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);
export default postgresConnectionSequelize;
