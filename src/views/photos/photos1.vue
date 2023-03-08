<template>

    <div class="gallery">
      <div class="gallery-grid">
        <div v-for="(block, index) in blocks" :key="index" class="gallery-block">
          <div v-for="(media, i) in block.media" :key="i" class="gallery-media" @click="openPreview(block.startIndex + i)">
            <template v-if="media.type === 'image'">
              <img :src="media.src" :alt="media.alt" />
            </template>
            <template v-else-if="media.type === 'video'">
              <video :src="media.src" :poster="media.poster" controls muted playsinline></video>
            </template>
          </div>
        </div>
      </div>
      <div v-if="showPreview" class="gallery-preview">
        <div class="gallery-preview-overlay" @click="closePreview"></div>
        <div class="gallery-preview-content">
          <div class="gallery-preview-media">
            <template v-if="previewMedia.type === 'image'">
              <img :src="previewMedia.src" :alt="previewMedia.alt" />
            </template>
            <template v-else-if="previewMedia.type === 'video'">
              <video :src="previewMedia.src" :poster="previewMedia.poster" controls muted></video>
            </template>
          </div>
          <div class="gallery-preview-nav">
            <div v-if="previewIndex > 0" class="gallery-preview-prev" @click="prevMedia">
              <span class="gallery-preview-arrow">&lt;</span>
            </div>
            <div v-if="previewIndex < mediaList.length - 1" class="gallery-preview-next" @click="nextMedia">
              <span class="gallery-preview-arrow">&gt;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
    //   mediaList: {
    //     type: Array,
    //     required: true,
    //     validator: (mediaList) =>
    //       mediaList.every(
    //         (media) => media.type === 'image' || media.type === 'video'
    //       ),
    //   },
      blockSize: {
        type: Number,
        default: 3,
      },
    },
    data() {
      return {
        blocks: [],
        showPreview: false,
        previewMedia: null,
        previewIndex: 0,
        mediaList: [{src:'https://firebasestorage.googleapis.com/v0/b/vuefirebaseauth-35637.appspot.com/o/photos%2F2021-01-28_15h04_58.png?alt=media&token=d6b3d3be-9256-47f3-b6a4-190c25771f4a',type: 'image' },{src:"https://firebasestorage.googleapis.com/v0/b/vuefirebaseauth-35637.appspot.com/o/photos%2FMidnight%20Runners%201%20(4K%20Cinematic%20Film%2C%20GTA%205%20Rockstar%20Editor).mp4?alt=media&token=102055d4-5934-4497-9d9f-5982b8682109",type: 'video'}]
      };
    },
    computed: {
      blockCount() {
        return Math.ceil(this.mediaList.length / this.blockSize);
      },
    },
    methods: {
      generateBlocks() {
        this.blocks = [];
        for (let i = 0; i < this.blockCount; i++) {
          this.blocks.push({
            startIndex: i * this.blockSize,
            media: this.mediaList.slice(
              i * this.blockSize,
              (i + 1) * this.blockSize
            ),
          });
        }
      },
      openPreview(index) {
        this.previewMedia = this.mediaList[index];
        this.previewIndex = index;
        this.showPreview = true;
      },
      closePreview() {
        this.showPreview = false;
      },
      nextMedia() {
        this.previewIndex++;
        this.previewMedia = this.mediaList[this.previewIndex];
      },
      prevMedia() {
        this.previewIndex--;
        this.previewMedia = this.mediaList[this.previewIndex];
      },
      mounted() {
        this.generateBlocks();
        },},
watch: {
    mediaList() {
      this.generateBlocks();
    },
  },
created () {
    this.generateBlocks()
}
};
</script>
   
<style scoped>
.gallery {
  margin: 20px 0;
}

.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.gallery-block {
  width: calc((100% / 3) - 10px);
  margin-bottom: 20px;
}

.gallery-media {
  position: relative;
  cursor: pointer;
}

.gallery-media img,
.gallery-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.gallery-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.gallery-preview-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.gallery-preview-media {
  max-width: 80%;
}

.gallery-preview-nav {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
}

.gallery-preview-prev,
.gallery-preview-next {
  cursor: pointer;
}

.gallery-preview-arrow {
  display: inline-block;
  font-size: 40px;
  color: #fff;
  margin: 0 20px;
}
</style>