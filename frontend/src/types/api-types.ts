type Product = {
    _id: string;
    name: string;
    photo: string;
    price: number;
    stock: number;
    category: string;
}

type User = {
    _id: string;
    name: string;
    photo: string;
    email: string;
    role: "admin" | "user";
    gender: string | null
}

export type ApiResponseType = {
    statusCode: number,
    data: {
        user?: {
            createdAt: string,
            dob: string | null,
            email: string,
            gender: string | null,
            name: string,
            photo: string,
            role: string,
            updatedAt: string,
            _id: string
        },
        products?: Product[],
        categories?: string[],
        length?: number,
        product?: Product,
        couponDoc?: {
            code: string,
            amount: number
        },
        orders?: Order[],
        order?: Omit<Order, "userInfo">,
        myOrders?: Omit<Order, "userInfo">[],
        users?: User[]

    },
    success: boolean,
    message: string
}

export type ApiErrorType = {
    status: boolean;
    data: {
        message: string;
        success: boolean;
        statusCode: number
    }
}

export type SearchProps = {
    category?: string;
    sort?: string;
    search?: string;
    price?: number;
    page?: number;
}


type Order = {
    ShippingInfo: {
        address: string,
        city: string,
        state: string,
        country: string,
        pinCode: string,
    },
    user: string,
    subTotal: number,
    tax: number,
    shippingCharges: number,
    discount: number,
    total: number,
    status: "Processing" | "Shipped" | "Delivered",
    orderItems: {
        name: string,
        photo: string,
        price: number,
        quantity: number,
        productId: string
    }[],
    _id: string,
    userInfo:
    {
        _id: string,
        name: string,
    }[]
}

export type DashBoardResponseType = {
    statusCode: number,
    success: boolean,
    message: string,
    data: {
        stats?: StatsDataType,
        pie?: PieDataType,
        bar?: BarDataType,
        line?: LineDataType
    }
}

export type StatsDataType = {
    latestTransactions: {
        _id: string
        amount: number,
        discount: number,
        quantity: number,
        status: string
    }[],
    categories: {
        totalItems: number,
        category: string
    }[],
    percentage: {
        userChangePercentage: number,
        productChangePercentage: number,
        orderChangePercentage: number,
        revenueChangePercentage: number
    },
    total: {
        totalUsers: number,
        totalProducts: number,
        totalOrders: number,
        totalRevenue: number
    },
    revenueOrderGrowth: {
        revenue: number[],
        order: number[],
    },
    userRatio: {
        male: number,
        female: number,
    }
}

export type PieDataType = {
    orderFulfillmentRatio: {
        count: number,
        status: string
    }[],
    productCategoryRatio: {
        count: number,
        category: string
    }[],
    stockAvailbility: {
        stock: number,
        outOfStock: number
    },
    revenueDistrubution: {
        grossIncome: number,
        discount: number,
        productionCharges: number,
        burnt: number,
        marketingCost: number,
        netmargin: number
    },
    ageGroup: {
        teen: number,
        adult: number,
        old: number
    },
    roleDistribution: {
        admin: number,
        user: number
    }
}

export type LineDataType = {
    activeUsers: number[],
    totalProducts: number[],
    totalRevenue: number[],
    totalDiscount: number[],
}

export type BarDataType =  {
            sixMonthProdut: number[],
            sixMonthUser: number[],
            twelveMonthorder: number[]
        }