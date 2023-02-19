<template>
    
  <div v-if="userrole == 'admin'">
  <Card>      
    <template #content>
          <h1 class="font-semibold spacing  text-xl">Posuvatelne menu</h1>
          <TabMenu class="mt-5" :model="items" :activeIndex="activeIndex" >
          </TabMenu>
          <p> Later Bitch</p>
          
          <FileUpload name="demo[]"  :multiple="true" accept="image/* , video/*"  @select="onSelectedFiles">
                    <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                        <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                            <div class="flex gap-2">
                                <p-button @click="chooseCallback()" icon="pi pi-images" class="p-button-rounded"></p-button>
                                <p-button @click="uploadEvent(uploadCallback, files)" icon="pi pi-cloud-upload" class="p-button-rounded p-button-success" :disabled="!files || files.length === 0"></p-button>
                                <p-button @click="clearCallback()" icon="pi pi-times" class="p-button-rounded p-button-danger" :disabled="!files || files.length === 0"></p-button>
                            </div>
                            <ProgressBar :value="totalSizePercent" :show-value="false" :class="['md:w-20rem h-1rem w-full md:ml-auto', {'exceeded-progress-bar': (totalSizePercent > 100)}]"><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar>
                        </div>
                    </template>
                    <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                        <div v-if="files.length > 0">
                            <h5>Pending</h5>
                            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                    <div>
                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                                    </div>
                                    <span class="font-semibold">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <Badge value="Pending" severity="warning"></Badge>
                                    <p-button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" class="p-button-outlined p-button-danger p-button-rounded"></p-button>
                                </div>
                            </div>
                        </div>

                        <div v-if="uploadedFiles.length > 0">
                            <h5>Completed</h5>
                            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                    <div>
                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                                    </div>
                                    <span class="font-semibold">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <Badge value="Completed" class="mt-3" severity="success"></Badge>
                                    <p-button icon="pi pi-times" @click="removeUploadedFileCallback(index)" class="p-button-outlined p-button-danger p-button-rounded"></p-button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <div class="flex align-items-center justify-content-center flex-column">
                            <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
                        </div>
                    </template>
                  </FileUpload>

        </template>
  </Card>
  </div>
</template>

<script>
import { getFirestore, setDoc, doc, getDocs, getDoc, collection } from "firebase/firestore";
import TabMenu from "primevue/tabmenu";
import Card from "primevue/card";
import { getAuth } from "firebase/auth";
import FileUpload from "primevue/fileupload";
import ProgressBar from "primevue/progressbar";
import Badge from 'primevue/badge'
import {getStorage,ref,uploadBytesResumable} from "firebase/storage";
export default {
  components: {
    
    TabMenu,
    Card,
    FileUpload,
    ProgressBar,
    Badge
  },
  data() {
    return {
      selectedUser: null,
      activeIndex: 0,
      users: [],
      userrole: "user",
      items: [
        { label: "Udalosti", icon: "pi pi-fw pi-home", to: "/admin" },
        { label: "Uzivatelia", icon: "pi pi-fw pi-calendar", to: "/admin/user" },
        { label: "Poznamky", icon: "pi pi-fw pi-pencil", to: "/admin/notes" },
        { label: "Ulozisko", icon: "pi pi-fw pi-file", to: "/admin/storage" },
      ],
      uploadedFiles: [],
      currentFile: null,
      uploadInProgress: false,
      uploadProgress: 0,
      totalSize : ref(0),
      totalSizePercent : ref(0),

    };
  },
  async created() {
    const db = getFirestore();
    const data = await getDocs(collection(db, "users"));
    data.forEach((doc) => {
      var username = doc.data().name + " " + doc.data().surname;
      var uid = doc.id;
      let obj1 = { name: username, uid: uid };
      this.users.push(obj1);
    });
    const uid = getAuth().currentUser.uid;
    const userdata = await getDoc(doc(db, "users", uid));

    this.userrole = userdata.data().role;

    if (this.userrole == "user") {
      this.$router.push("/dashboard");
    }
  },
  methods: {
    async uploadEvent(callback, files) {
      
                    await this.myUploader(callback, files)  
                    


    },

    onSelectedFiles(event) {
                        this.files = event.files;
                        this.files.forEach((file) => {
                            this.totalSize += parseInt(this.formatSize(file.size));
                        });
                    },
                    onRemoveTemplatingFile(file, fileRemoveCallback, index) {
                        fileRemoveCallback(index);
                        this.totalSize -= parseInt(this.formatSize(file.size));
                        this.totalSizePercent = this.totalSize / 10;
                    },
    formatSize(bytes) {
                        if (bytes === 0) {
                            return '0 B';
                        }

                        let k = 1000,
                            dm = 3,
                            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                            i = Math.floor(Math.log(bytes) / Math.log(k));

                        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
                    },
    async myUploader(callback,files) {
      const storage = getStorage();

      for (const file of files) {
        var count = 0
        this.uploadInProgress = true;
        this.currentFile = file;

        const mountainsRef = ref(storage, "photos/" + file.name);
        const uploadTask = uploadBytesResumable(mountainsRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Update progress bar
            this.totalSizePercent =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error(error);
            this.uploadInProgress = false;
            this.currentFile = null;
            this.uploadProgress = 0;
          },
          async () => {
            // Handle successful uploads on complete
            console.log("Upload successful");
            
            count += 1
            if (count == files.length) {
              callback()
            }
            this.uploadProgress = 0;
          }
        );
      }
    },

  },
};
</script>

