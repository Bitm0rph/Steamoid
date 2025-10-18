class ApiResponse {
    constructor(statusCode, total, message = "Success"){
        this.statusCode = statusCode
        this.total_products = total
        this.message = message
        this.success = statusCode < 400
    }
}

class ApiResponseGet {
    constructor(statusCode, data, page, limit, total, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.page = page
        this.limit = limit
        this.total_products = total
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse, ApiResponseGet }