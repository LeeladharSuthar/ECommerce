import { NextFunction, Request, Response } from "express"
import { Controller } from "../types/types.js"
import { ApiError } from "./ApiError.js"

const asyncHandler = (fun: Controller) => async (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fun(req, res, next)).catch(next)
}

// const asyncHandler = (fun: Controller) => async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await fun(req, res, next);
//     } catch (error:unknown) {
//         next(error);
//     }
// };

export { asyncHandler }
