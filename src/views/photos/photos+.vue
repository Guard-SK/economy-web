<template>
  <div class="gallery">
    <div class="gallery-grid">
      <div v-for="(block, index) in blocks" :key="index" class="gallery-block">
        <div v-for="(image, i) in block.images" :key="i" class="gallery-image" @click="openPreview(block.startIndex + i)">
          <img :src="image" :alt="image.alt" />
          {{ image.url }}
        </div>
      </div>
    </div>
    <div v-if="showPreview" class="gallery-preview">
      <div class="gallery-preview-overlay" @click="closePreview"></div>
      <div class="gallery-preview-content">
        <div class="gallery-preview-image">
          <img :src="previewImage" :alt="previewImage.alt" />
        </div>
        <div class="gallery-preview-nav">
          <div v-if="previewIndex > 0" class="gallery-preview-prev" @click="prevImage">
            <span class="gallery-preview-arrow">&lt;</span>
          </div>
          <div v-if="previewIndex < images.length - 1" class="gallery-preview-next" @click="nextImage">
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
    
    blockSize: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      blocks: [],
      showPreview: false,
      previewImage: null,
      previewIndex: 0,
      images: [
      'https://firebasestorage.googleapis.com/v0/b/vuefirebaseauth-35637.appspot.com/o/photos%2F2021-01-28_15h04_58.png?alt=media&token=d6b3d3be-9256-47f3-b6a4-190c25771f4a',
      'https://firebasestorage.googleapis.com/v0/b/vuefirebaseauth-35637.appspot.com/o/photos%2FNov%C3%A9%20video.mp4?alt=media&token=5659f553-754d-45b6-b511-6f37ce4b6a17'


    ],
    };
  },
  computed: {
    blockCount() {
      return Math.ceil(this.images.length / this.blockSize);
    },
  },
  methods: {
    generateBlocks() {
      this.blocks = [];
      for (let i = 0; i < this.blockCount; i++) {
        this.blocks.push({
          startIndex: i * this.blockSize,
          images: this.images.slice(i * this.blockSize, (i + 1) * this.blockSize),
        });
      }
    },
    openPreview(index) {
      this.previewImage = this.images[index];
      this.previewIndex = index;
      this.showPreview = true;
    },
    closePreview() {
      this.showPreview = false;
    },
    nextImage() {
      this.previewIndex++;
      this.previewImage = this.images[this.previewIndex];
    },
    prevImage() {
      this.previewIndex--;
      this.previewImage = this.images[this.previewIndex];
    },
  },
  mounted() {
    this.generateBlocks();
  },
};
</script>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
}

.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.gallery-block {
  width: calc(33.33% - 10px);
  margin-bottom: 20px;
}

.gallery-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  cursor: pointer;
}

.gallery-image img {
  position: absolute;
  top: 0;
  left: 0;
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
  display: flex;
  justify-content: center;
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

.gallery-preview-image {
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