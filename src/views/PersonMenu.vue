<template>
  <mainLayout />
  <Navigation />
  <personMenu v-if="isLoaded" :personalities="personalities" />
</template>

<script setup>
import mainLayout from '../components/mainLayout.vue';
import Navigation from '@/components/Navigation.vue';
import personMenu from '@/components/personMenu.vue';
import { ref, onMounted } from 'vue';
import useAxios from '@/utils/useAxios';

const intercepter = useAxios();
const isLoaded = ref(false);
const personalities = ref([]);

const fetchPersonalities = async () => {
    const result = await intercepter.get('http://localhost:8000/app/get-personalities/')
    .then(res => {
        return res.data.personalities;
    })
    .catch(err => {
        console.log(err);
    })

    return result;
};

onMounted(async () => {
    isLoaded.value = false;
    personalities.value = await fetchPersonalities();
    isLoaded.value = true;
});

</script>