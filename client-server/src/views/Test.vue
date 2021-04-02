<template>
  <div class="test">
    <h1>This is test page</h1>
    <div class="messageinfo">
        <div>
            <span>{{message}}</span>
        </div>
        <div>
            <div v-for="(item, index) in sourceData" :key="index">
                <span>{{ item.item }} - {{item.count}}</span>
            </div>
        </div>
        <div>
            <button type="button" @click="handleData">Change Data</button>
        </div>
        <div>
            <button type="button" @click="handleConnect">handleConnect</button>
        </div>
        <div>
            <button type="button" @click="handleCloseConnect">handleCloseConnect</button>
        </div>
    </div>
    <div>
        <v-chart :forceFit="true" :height="height" :data="data" :scale="scale">
            <v-tooltip :showTitle="false" data-key="item*percent"/>
            <v-axis/>
            <v-legend data-key="item"/>
            <v-pie position="percent" color="item" :vStyle="pieStyle" :label="labelConfig"/>
            <v-coord type="theta" :radius="0.75" :innerRadius="0.6"/>
        </v-chart>
    </div>
  </div>
</template>

<script>
const DataSet = require("@antv/data-set");
// import DataSet from "@antv/data-set"

export default {
    name: 'test',
    data() {
        return {
            message: 'default is null.',
            socket: null,
            sourceData: [
                { item: "学习", count: 40 },
                { item: "听歌", count: 21 },
                { item: "锻炼", count: 17 },
                { item: "游戏", count: 13 },
                { item: "发呆", count: 9 }
            ],
            dataSetView: new DataSet().createView(),
            scale: {
                dataKey: "percent",
                min: 0,
                formatter: ".0%"
            },
            transformConfig: {
                type: "percent",
                field: "count",
                dimension: "item",
                as: "percent"
            },
            height: 400,
            pieStyle: {
                stroke: "#fff",
                lineWidth: 1
            },
            labelConfig: [
                "percent",
                {
                formatter: (val, item) => {
                    return item.point.item + ": " + val;
                }
                }
            ]
        };
    },

    computed: {
        data (){
            return this.dataSetView.source(this.sourceData).transform(this.transformConfig).rows
        }
    },

    mounted() {
        this.getTestData()
        this.socketListener()
    },

    methods: {
        getTestData () {
            this.$axios.get('http://localhost:6123/expressserver/test').then((res) => {
                console.log(res)
                this.message = res.data
            }).catch(function (error) {
                console.log(error);
            });
        },
        handleData () {
            this.sourceData = [
                { item: "学习", count: Math.floor(Math.random() * 20 + 10) },
                { item: "听歌", count: Math.floor(Math.random() * 20 + 10) },
                { item: "锻炼", count: Math.floor(Math.random() * 20 + 10) },
                { item: "游戏", count: Math.floor(Math.random() * 20 + 10) },
                { item: "发呆", count: Math.floor(Math.random() * 20 + 10) }
            ]
        },
        handleConnect () {
            this.socketListener()
        },
        handleCloseConnect () {
            this.socket.close()
            this.socket = null
        },
        socketListener (){
            this.socket = new WebSocket('ws://localhost:3000/websocket/test')

            this.socket.onopen = e => {
                console.log(`WebSocket 连接状态： ${this.socket.readyState}`)
            }

            this.socket.onmessage = data => {
                // this.message = data.data
                try {
                    let tempData = JSON.parse(data.data)
                    this.sourceData = tempData
                } catch (error) {
                    this.message = data.data
                }
            }

            this.socket.onclose = data => {
                console.log('WebSocket连接已关闭')
                console.log(data);
            }
        }
    }
}
</script>

<style lang="scss">

.test{
    > div{
        min-height: 15rem;
        padding: 1rem;
        border: 2px pink solid;
    }
}

</style>
