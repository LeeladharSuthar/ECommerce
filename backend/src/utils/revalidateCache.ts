import { myCache } from "../app.js"

export const revalidateCahce = async ({ product, order, admin }: { product?: boolean, order?: boolean, admin?: boolean }) => {
    if (product) {
        let keys: string[] = []
        keys = ["latestProducts", "categories"]
        myCache.del(keys)
    }
    if (order) {

    }
}