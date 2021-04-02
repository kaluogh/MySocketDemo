<template>
  <div class="test">
    <h1>This is test page</h1>
    <div class="messageinfo">
        <span>{{message}}</span>
        <div>
            <button type="button" @click="handleData">Change Data</button>
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
            this.$axios.get('http://localhost:6123/expressserver/api/test').then((res) => {
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
        socketListener (){
            let socket = new WebSocket("ws://localhost:3000/ws");
            socket.addEventListener("open", function (event) {
                console.log("socket is open")
                socket.send("这里是html发送过来的")
            });

            socket.addEventListener("message", function (event) {
                console.log("Message from server", event.data);
            });
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
