<template>
  <div class="test">
    <h1>This is test page</h1>
    <div>
        {{message}}
    </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            message: 'default is null.'
        }
    },

    mounted() {
        this.$axios.get('http://localhost:6123/expressserver/api/test').then(function(res){
            console.log(res)
        }).catch(function (error) {
            console.log(error);
        });
    }
}
</script>

<style lang="scss">

.test{
    div{
        min-height: 15rem;
        padding: 1rem;
        border: 2px pink solid;
    }
}

</style>
