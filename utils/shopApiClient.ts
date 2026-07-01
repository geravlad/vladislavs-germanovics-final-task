import { APIRequestContext } from "@playwright/test";
import { ShopUser } from "./testData";

export interface Product {
    id: number;
    name: string;
    price: string;
    brand: string;
    category: unknown;
}

export interface ProductsResponse {
    responseCode: number;
    products: Product[];
}

export class ShopApiClient {
    constructor(private readonly request: APIRequestContext) {

    }

    async getProducts(): Promise<ProductsResponse> {
        const response = await this.request.get('/api/productsList');

        const body = await response.json();
        if (!response.ok()) throw new Error(`Listing products failed: ${response.status()}: ${JSON.stringify(body)}`)
        return body;
    }

    async searchProducts(keyword: string): Promise<ProductsResponse> {
        const response = await this.request.post('/api/searchProduct', {
            form: { search_product: keyword },
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`Product search failed: ${response.status()}: ${JSON.stringify(body)}`)
        return body;
    }

    async createAccount(user: ShopUser): Promise<void> {
        const response = await this.request.post('/api/createAccount', {
            form: {
                name: user.name,
                email: user.email,
                password: user.password,
                birth_date: user.birthDay,
                birth_month: user.birthMonth,
                birth_year: user.birthYear,
                firstname: user.firstName,
                lastname: user.lastName,
                address1: user.address,
                country: user.country,
                zipcode: user.zipCode,
                state: user.state,
                city: user.city,
                mobile_number: user.mobileNumber,
            },
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`Account creation failed: ${response.status()}: ${JSON.stringify(body)}`)
    }

    async deleteAccount(email: string, password: string): Promise<void> {
        const response = await this.request.delete('/api/deleteAccount', {
            form: { email, password },
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`Account deletion failed: ${response.status()}: ${JSON.stringify(body)}`)
    }

    async verifyLogin(email: string, password: string): Promise<boolean> {
        const response = await this.request.post('/api/verifyLogin', {
            form: { email, password },
        });
        const body = await response.json();
        if (!response.ok()) throw new Error(`Verification failed: ${response.status()}: ${JSON.stringify(body)}`)
        return body.responseCode === 200;
    }
}
