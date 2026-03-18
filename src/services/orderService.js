import axios from 'axios';

class OrderService {
    #url = '/order';

    // 주문 화면 초기 데이터 조회
    async getOrderInfo() {
        const res = await axios.get(this.#url);
        return res.data;
    }

    // 주문 확정
    async placeOrder(orderData) {
        const res = await axios.post(this.#url, orderData);
        return res.data;
    }
    // 토스 결제 승인 요청
    async confirmPayment(paymentData) {
      const res = await axios.post('/payment/confirm', paymentData);
      return res.data;
  }
}
export default new OrderService();
