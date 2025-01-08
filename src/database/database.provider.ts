import { Bookmark } from "@/modules/bookmark/bookmark.model";
import { ConfigService } from "@nestjs/config";
import { Sequelize } from "sequelize-typescript";

export const providers = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: `./data/${config.get<string>('DB_NAME')}.db`,
        dialectOptions: {
          connectTimeout: 30000,
        },
        pool: {
          max: 100,
          min: 0,
          idle: 10000,
        },
      });
      sequelize.addModels([Bookmark]);
      await sequelize.sync();
      return sequelize;
    },
  },
]
