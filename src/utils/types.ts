export interface generateTokenProps {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
}

export interface JWTPayload {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  iat: number;
  exp: number;
}

export interface OrderData {
  userId: number;
  addressId: number;
  cartId: number;
  payment_email: string;
  sessionId: string;
}
