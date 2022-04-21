<template>
  <v-container fluid>
    <v-row dense>
      <v-col v-for="(item, i) in items" :key="i" :cols="6">
        <v-card max-width="500" min-height="170" max-height="300">
          <v-card-title>{{item.title}}</v-card-title>
          <v-card-subtitle>{{item.subtitle}}</v-card-subtitle>
          <v-card-text>
            {{item.text}}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  head() {
    return {
      title: "Página principal"
    }
  },
  data() {
    return {
      items: [
        {
          title: 'Lorem Ipsum',
          subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget imperdiet velit, et tincidunt nisi. Suspendisse vestibulum, nunc sit amet venenatis posuere, diam mi faucibus odio, ut molestie est purus sed sem. In non sagittis risus. Curabitur vitae ipsum velit. Proin tincidunt turpis et nulla laoreet porttitor. '
        },
        {
          title: 'Lorem Ipsum',
          subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget imperdiet velit, et tincidunt nisi. Suspendisse vestibulum, nunc sit amet venenatis posuere, diam mi faucibus odio, ut molestie est purus sed sem. In non sagittis risus. Curabitur vitae ipsum velit. Proin tincidunt turpis et nulla laoreet porttitor. '
        },
        {
          title: 'Lorem Ipsum',
          subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget imperdiet velit, et tincidunt nisi. Suspendisse vestibulum, nunc sit amet venenatis posuere, diam mi faucibus odio, ut molestie est purus sed sem. In non sagittis risus. Curabitur vitae ipsum velit. Proin tincidunt turpis et nulla laoreet porttitor. '
        },
        {
          title: 'Lorem Ipsum',
          subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget imperdiet velit, et tincidunt nisi. Suspendisse vestibulum, nunc sit amet venenatis posuere, diam mi faucibus odio, ut molestie est purus sed sem. In non sagittis risus. Curabitur vitae ipsum velit. Proin tincidunt turpis et nulla laoreet porttitor. '
        },
        {
          title: 'Lorem Ipsum',
          subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget imperdiet velit, et tincidunt nisi. Suspendisse vestibulum, nunc sit amet venenatis posuere, diam mi faucibus odio, ut molestie est purus sed sem. In non sagittis risus. Curabitur vitae ipsum velit. Proin tincidunt turpis et nulla laoreet porttitor. '
        },
        {
          title: 'Lorem Ipsum',
          subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget imperdiet velit, et tincidunt nisi. Suspendisse vestibulum, nunc sit amet venenatis posuere, diam mi faucibus odio, ut molestie est purus sed sem. In non sagittis risus. Curabitur vitae ipsum velit. Proin tincidunt turpis et nulla laoreet porttitor. '
        },
        {
          title: 'Lorem Ipsum',
          subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget imperdiet velit, et tincidunt nisi. Suspendisse vestibulum, nunc sit amet venenatis posuere, diam mi faucibus odio, ut molestie est purus sed sem. In non sagittis risus. Curabitur vitae ipsum velit. Proin tincidunt turpis et nulla laoreet porttitor. '
        },
        {
          title: 'Lorem Ipsum',
          subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget imperdiet velit, et tincidunt nisi. Suspendisse vestibulum, nunc sit amet venenatis posuere, diam mi faucibus odio, ut molestie est purus sed sem. In non sagittis risus. Curabitur vitae ipsum velit. Proin tincidunt turpis et nulla laoreet porttitor. '
        },
        {
          title: 'Lorem Ipsum',
          subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget imperdiet velit, et tincidunt nisi. Suspendisse vestibulum, nunc sit amet venenatis posuere, diam mi faucibus odio, ut molestie est purus sed sem. In non sagittis risus. Curabitur vitae ipsum velit. Proin tincidunt turpis et nulla laoreet porttitor. '
        },
        {
          title: 'Lorem Ipsum',
          subtitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget imperdiet velit, et tincidunt nisi. Suspendisse vestibulum, nunc sit amet venenatis posuere, diam mi faucibus odio, ut molestie est purus sed sem. In non sagittis risus. Curabitur vitae ipsum velit. Proin tincidunt turpis et nulla laoreet porttitor. '
        },
      ],
    }
  }
}
</script>
