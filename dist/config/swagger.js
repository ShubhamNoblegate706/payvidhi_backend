import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "HRMS Project API",
            version: "1.0.0",
            description: "Production Ready Express API",
        },
        servers: [
            {
                url: "http://localhost:9878",
            },
            {
                url: "http://3.112.89.56:9878",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};
const swaggerSpec = swaggerJsdoc(options);
export const setupSwagger = (app) => {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
//# sourceMappingURL=swagger.js.map