<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
onMounted(async () => {
    try{
        const response = await axios.get('/api/owner/order');
        orders.value = response.data.result;
    } catch (error){
        console.error("주문 정보를 가져오는 중 에러 발생: ", error);
    }
});
</script>

<template>
<div class="order-list">
    <table>
      <thead>
        <tr>
          <th>NO.</th><th>주문시간</th><th>주소</th><th>메뉴</th><th>결제금액</th><th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.orderId">
          <td>{{ order.no }}</td>
          <td>{{ order.orderTime }}</td>
          <td>{{ order.address }}</td>
          <td>{{ order.menuName }}</td>
          <td>{{ order.price }}원</td>
          <td>{{ order.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>