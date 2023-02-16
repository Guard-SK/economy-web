<template>
    <p-table :value="classes" v-model:expandedRows="expandedRows" dataKey="id" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" responsiveLayout="scroll">
            <template #header>
                <div class="table-header-container">
                    <Button icon="pi pi-plus" label="Expand All" @click="expandAll" class="mr-2" />
                    <Button icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                </div>
            </template>
            <Column :expander="true" headerStyle="width: 3rem" />
            <Column field="class" header="Predmety" sortable></Column>
            <template #expansion="slotProps">
                <div class="orders-subtable">
                    
                    <p-table :value="slotProps.data.docs" responsiveLayout="scroll">
                        <Column field="docname" header="Meno dokumentu"></Column>
                       <Column headerStyle="width:4rem">
                            <template #body="{data}">
                                <Button @click="redirectToFile(data.view)" icon="pi pi-search" label="View"/>
                            </template>
                        </Column>
                        <Column headerStyle="width:4rem">
                            <template  #body="{data}">
                                <Button @click="linkopen(data.link)" icon="pi pi-search" label="Link"/>
                            </template>
                        </Column>
                    </p-table>
                </div>
            </template>
        </p-table>
</template>
<script>
import { getFirestore,setDoc ,doc,getDocs,getDoc,collection} from "firebase/firestore";
import Dropdown from 'primevue/dropdown';
import Column from "primevue/column";
import Button from "primevue/button";
export default {
    components:{
        Dropdown,
        Column,
        Button

    },
data () {
    return{

        classes: [],
        expandedRows: []
        
    }

},
async created() {
    const db = getFirestore()
    const classesSnap = await getDocs(collection(db,'notes'))
    classesSnap.forEach(async class1 => {
        const docsclass = await getDocs(collection(db,'notes', class1.id,'docs'))
        const docsprep = []
        docsclass.forEach(doc6 => {
            
            const data = {
                docname: doc6.id,
                view: doc6.data().view,
                link: doc6.data().link
            }
            docsprep.push(data)
        })
        const finalprep = {
            class: class1.id,
            id: class1.data().id,
            docs: docsprep
        }
        this.classes.push(finalprep)
    })
    
    
},
methods:{
    linkopen (url) {
        window.open(url,"_blank")
    },
    onRowExpand(event) {
            
        },
        onRowCollapse(event) {
            
        },
        expandAll() {
            this.expandedRows = this.classes.filter(p => p.id);
            
        },
        collapseAll() {
            this.expandedRows = null;
            
        },
    async userset(){
        console.log(this.selectedUser.uid)
    },
    async redirectToFile(filename) {
        console.log(filename);
        this.$router.push({name: 'FileView',params: {filename:filename}})
    }
}
}
</script>