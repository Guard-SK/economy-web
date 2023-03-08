<template>
    <div class="card flex justify-content-center">
        <Galleria v-model:activeIndex="activeIndex" v-model:visible="displayCustom" :value="images" :responsiveOptions="responsiveOptions" :numVisible="7"
            containerStyle="max-width: 850px" :circular="true" :fullScreen="true" :showItemNavigators="true" :showThumbnails="false">
            <template #item="slotProps">
                <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
            </template>
            <template #thumbnail="slotProps">
                <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block" />
            </template>
        </Galleria>

        <div v-if="images" class="grid" style="max-width: 400px">
            <div v-for="(image, index) of images" :key="index" class="col-4">
                <img :src="image.thumbnailImageSrc" :alt="image.alt" style="cursor: pointer" @click="imageClick(index)" />
            </div>
        </div>
    </div>
</template>
  
  <script>
  import Galleria from 'primevue/galleria';
  export default {
    components: {
        Galleria
    },
    
    data() {
      return {

        previewImage: null,
        activeIndex: 0,
        displayCustom:true,
        responsiveOptions: [
                {
                    breakpoint: '1024px',
                    numVisible: 5
                },
                {
                    breakpoint: '768px',
                    numVisible: 3
                },
                {
                    breakpoint: '560px',
                    numVisible: 1
                }
            ],
            images: [{
                itemImageSrc: 'https://primevue.org/images/galleria/galleria1.jpg',
                thumbnailImageSrc: 'https://primevue.org/images/galleria/galleria1s.jpg',
                alt: 'Description for Image 1',
                title: 'Title 1'
            },
            {
                itemImageSrc: 'https://firebasestorage.googleapis.com/v0/b/vuefirebaseauth-35637.appspot.com/o/photos%2FScreenshot_2023-02-18-13-18-01-096_lockscreen.jpg?alt=media&token=2e285354-d52b-4e7b-8a71-f46c7ccc1492',
                thumbnailImageSrc: 'https://firebasestorage.googleapis.com/v0/b/vuefirebaseauth-35637.appspot.com/o/photos%2FScreenshot_2023-02-18-13-18-01-096_lockscreen.jpg?alt=media&token=2e285354-d52b-4e7b-8a71-f46c7ccc1492',
                alt: 'Description for Image 2',
                title: 'Title 2'
            },
            {
                itemImageSrc: 'https://firebasestorage.googleapis.com/v0/b/vuefirebaseauth-35637.appspot.com/o/photos%2F2021-01-28_15h04_58.png?alt=media&token=d6b3d3be-9256-47f3-b6a4-190c25771f4a',
                thumbnailImageSrc: 'https://firebasestorage.googleapis.com/v0/b/vuefirebaseauth-35637.appspot.com/o/photos%2F2021-01-28_15h04_58.png?alt=media&token=d6b3d3be-9256-47f3-b6a4-190c25771f4a',
                alt: 'Description for Image 3',
                title: 'Title 3'
            },]
    //     images: [
    //     'https://firebasestorage.googleapis.com/v0/b/vuefirebaseauth-35637.appspot.com/o/photos%2F2021-01-28_15h04_58.png?alt=media&token=d6b3d3be-9256-47f3-b6a4-190c25771f4a',
    //     'https://firebasestorage.googleapis.com/v0/b/vuefirebaseauth-35637.appspot.com/o/photos%2FNov%C3%A9%20video.mp4?alt=media&token=5659f553-754d-45b6-b511-6f37ce4b6a17'
  
  
    //   ],
      };
    },

    methods: {
        imageClick(index) {
            this.activeIndex = index;
            this.displayCustom = true;
        },
    }
  };
  </script>
  
  