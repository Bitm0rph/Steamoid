class ApiResponse {
    constructor(statusCode, data, message, page, limit, total,){
        this.statusCode = statusCode
        this.data = data
        this.page = page
        this.limit = limit
        this.total_products = total
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }