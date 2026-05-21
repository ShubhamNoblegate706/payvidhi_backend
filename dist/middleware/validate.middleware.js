import { ZodError } from "zod";
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error,
            });
            return;
        }
        next(error);
    }
};
//# sourceMappingURL=validate.middleware.js.map