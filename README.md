# E-Commerce Store API

Used node, redis for this project

## Installation or Use the live link

Live link: 
[Click here](https://cart-lac-eight.vercel.app/)

Clone the repository:

```bash
git clone https://github.com/anirudhp26/cart
cd cart
```

Install dependencies:

```bash
npm install
```

Configure environment variables in a `.env` file:

```env
PORT=3000
REDIS_URL=<your redis url> (if not there contact me)
```

Start the server:

```bash
npm run dev
```

## API Documentation

### Base URL

```
http://localhost:3000
```
## APIs

### User APIs

#### 1. Add Item to Cart

**Endpoint:**

```http
POST /cart/add-item
```

**Request Body:**

```json
{
    "userId": 1,
    "item": {
        "name": "ep645",
        "quantity": 5,
        "price": "65.5",
        "currency": "INR"
    }
}
```

**Response:**

```json
{
  "message": "Item added to cart"
}
```

#### 2. Checkout

**Endpoint:**

```http
POST /cart/checkout
```

**Request Body:**

```json
{
  "userId": "1",
  "discountCode": "10POFF2" // Optional
}
```

**Response (Without Discount Code):**

```json
{
  "message": "Order placed successfully",
  "total": 65.5
}
```

**Response (With Valid Discount Code):**

```json
{
    "message": "Order placed successfully",
    "total": 58.95
}
```

**Response (Invalid Discount Code):**

```json
{
  "message": "Invalid discount code"
}
```

### Admin APIs

#### 1. Generate Discount Code

**Endpoint:**

```http
POST /admin/get-discount
```

With Header:
```bash
Authorization: admin
```

**Response (Eligible):**

```json
{
    "code": "10POFF2"
}
```

**Response (Not Eligible):**

```json
{
    "message": "Not eligible for a discount code."
}
```

#### 2. View Statistics

**Endpoint:**

```http
GET /admin/stats
```

With Header:
```bash
Authorization: admin
```

**Response:**

```json
{
    "totalOrders": 2,
    "discountCodes": [
        "10POFF2"
    ],
    "totalDiscountsGiven": 1
}
```

## Testing

**This api is tested using Jest and supertest**

Run the following command for testing

```bash
npm test
```