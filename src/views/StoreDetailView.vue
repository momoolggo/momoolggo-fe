<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MenuItem from '@/components/MenuCard.vue';
import MenuDetailModal from '@/components/MenuModal.vue';
import storeService from '@/services/storeService';

const route = useRoute();
const router = useRouter();

// --- 상태 관리 ---
const state = reactive({
    storeInfo: {
        name: '',
        avg: 0,
        sum: 0, // 리뷰 수
        min: 0,
        pic: '',
        deliveryTime: '30~60분', // 임시
        deliveryTip: 1500      // 임시
    },
    menuList: [],
    activeTab: 'menu',
    selectedMenu: {},
    isModalOpen: false
});

// --- 데이터 가져오기 ---
const getStoreDetail = async () => {
    const storeId = route.params.id;
    try {
        // 1. 가게 정보 가져오기 (이미 만든 서비스 활용)
        // 실제로는 상세조회 API가 따로 있다면 그걸 호출하세요.
        const res = await storeService.getStoreInfo(storeId);
        state.storeInfo = res.data;

        // 2. 해당 가게의 메뉴 리스트 가져오기
        const menuRes = await storeService.getMenuList(storeId);
        state.menuList = menuRes.data;
    } catch (error) {
        console.error("데이터 로드 실패:", error);
        // 테스트용 가상 데이터
        state.storeInfo = { name: '코이보타루', avg: 5.0, sum: 1253, min: 15000, pic: '' };
        state.menuList = [
            { id: 1, name: '참돔 오차즈케', price: 21000, desc: '밥+참돔+녹차+장국 구성', pic: '' },
            { id: 2, name: '연어 오차즈케', price: 18000, desc: '밥+연어+녹차+장국 구성', pic: '' }
        ];
    }
};

onMounted(getStoreDetail);

// --- 모달 제어 ---
const openMenuModal = (menu) => {
    state.selectedMenu = menu;
    state.isModalOpen = true;
};

const closeDetail = () => router.back();

const handleAddToCart = (item) => {
    console.log("장바구니 담기:", item);
    state.isModalOpen = false;
    // 이후 장바구니 로직 추가
};
</script>

<template>
<div class="store-detail-view">
    <section class="store-header">
        <div class="header-top">
            <button class="back-btn" @click="closeDetail">〈</button>
            <div class="header-icons">
                <button>🔍</button>
                <button>🏠</button>
            </div>
        </div>

        <div class="store-main-info">
            <div class="info-text">
                <h1>{{ state.storeInfo.name }}</h1>
                <div class="rating-row">
                    <span class="star">⭐ {{ state.storeInfo.avg }}</span>
                    <span class="review-count">({{ state.storeInfo.sum.toLocaleString() }})</span>
                </div>
                <ul class="delivery-details">
                    <li><span>최소 주문 금액</span> {{ state.storeInfo.min?.toLocaleString() }}원</li>
                    <li><span>예상 배달 시간</span> {{ state.storeInfo.deliveryTime }}</li>
                    <li><span>배달 팁</span> {{ state.storeInfo.deliveryTip?.toLocaleString() }}원</li>
                </ul>
            </div>
            <div class="info-visual">
                <img :src="state.storeInfo.pic || '/images/default-store.png'" class="store-img" />
                <button class="wish-btn">🤍</button>
            </div>
        </div>
    </section>

    <nav class="detail-tabs">
        <button :class="{ active: state.activeTab === 'menu' }" @click="state.activeTab = 'menu'">메뉴</button>
        <button :class="{ active: state.activeTab === 'info' }" @click="state.activeTab = 'info'">가게정보</button>
        <button :class="{ active: state.activeTab === 'review' }" @click="state.activeTab = 'review'">리뷰</button>
    </nav>

    <div v-if="state.activeTab === 'menu'" class="menu-container">
        <MenuItem
            v-for="menu in state.menuList"
            :key="menu.id"
            :menu="menu"
            @click-menu="openMenuModal"
        />
    </div>

    <MenuDetailModal
        :menu="state.selectedMenu"
        :is-open="state.isModalOpen"
        @close="state.isModalOpen = false"
        @add-to-cart="handleAddToCart"
    />
</div>
</template>

<style scoped>
.store-detail-view { max-width: 600px; margin: 0 auto; background: #fff; min-height: 100vh; }

/* 헤더 상단 버튼 */
.header-top { display: flex; justify-content: space-between; padding: 15px; position: sticky; top: 0; background: #fff; z-index: 50; }
.header-top button { background: none; border: none; font-size: 20px; cursor: pointer; }

/* 가게 정보 영역 */
.store-header { padding: 0 20px 20px; border-bottom: 8px solid #f5f5f5; }
.store-main-info { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 10px; }
.info-text h1 { font-size: 1.6rem; margin: 0 0 8px 0; }
.rating-row { font-size: 1.1rem; margin-bottom: 15px; }
.delivery-details { list-style: none; padding: 0; font-size: 0.9rem; color: #666; }
.delivery-details li { margin-bottom: 6px; }
.delivery-details span { display: inline-block; width: 100px; color: #999; }

.info-visual { position: relative; }
.store-img { width: 120px; height: 120px; border-radius: 12px; object-fit: cover; }
.wish-btn { position: absolute; top: 5px; right: 5px; background: none; border: none; font-size: 20px; cursor: pointer; }

/* 탭 스타일 */
.detail-tabs { display: flex; border-bottom: 1px solid #eee; position: sticky; top: 50px; background: #fff; z-index: 40; }
.detail-tabs button { flex: 1; padding: 15px; border: none; background: none; color: #999; font-size: 1rem; cursor: pointer; }
.detail-tabs button.active { color: #333; font-weight: bold; border-bottom: 3px solid #333; }

.menu-container { padding: 15px; background: #fff; }
</style>
