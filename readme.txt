npm install prisma --save-dev
npm install @prisma/client
npx prisma init --datasource-provider postgresql


Se requiere en el env para PRISMA
postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_DB?schema=SCHEMA


npx prisma db pull
npx prisma migrate reset
npx prisma migrate dev --name init_product_models

npx prisma generate  ////     npx prisma migrate dev --name ProductCategory


para la seed necesario ts-node   
npm install -D ts-node typescript @types/node
npm run seed