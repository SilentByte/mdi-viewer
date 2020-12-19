<!--
    MARKSMEN ONLINE PLATFORM
    Copyright (c) 2020 by MARKSMEN <https://marksmen.ch/>
-->

<!--suppress JSUnresolvedVariable, HtmlUnknownTarget -->
<template>
    <v-app>
        <v-app-bar dark app
                   class="pe-3 align-center justify-center"
                   color="primary">

            <v-toolbar-title class="me-6 text-uppercase">
                <span class="font-weight-bold">MDI</span><span class="font-weight-light">Viewer</span>
            </v-toolbar-title>

            <v-text-field light solo hide-details
                          autofocus clearable
                          prepend-inner-icon="mdi-magnify"
                          placeholder="Search…"
                          @input="onSearch"
                          @keydown.esc.stop="search = null" />
        </v-app-bar>
        <v-main v-resize="onResize">
            <v-virtual-scroll bench="10"
                              :items="rows"
                              :item-height="80"
                              :height="height">
                <template v-slot:default="{ item }">
                    <v-container>
                        <v-row>
                            <v-col v-for="icon in item" :key="icon.n"
                                   class="text-center">
                                <v-btn large icon
                                       color="primary"
                                       :title="icon.n"
                                       @click="onClick(icon.n)">
                                    <v-avatar tile size="24">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                            <path :d="icon.p" />
                                        </svg>
                                    </v-avatar>
                                </v-btn>
                                <div style="font-size: 8px"
                                     :id="icon.n"
                                     :title="icon.n">
                                    {{ icon.n }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </template>
            </v-virtual-scroll>
        </v-main>
    </v-app>
</template>

<!--suppress JSMethodCanBeStatic, JSUnusedGlobalSymbols -->
<script lang="ts">

import debounce from "lodash/debounce";
import chunk from "lodash/chunk";

import Fuse from "fuse.js";

import {
    Component,
    Vue,
} from "vue-property-decorator";

import MDI_META from "@/mdi.gen.json";

const fuse = new Fuse(MDI_META, {
    shouldSort: true,
    keys: ["n", "a", "t"],
});

function copyTextToClipboard(text: string) {
    const element = document.createElement("input");
    document.getElementsByTagName("body")[0].append(element);
    element.value = text;
    element.select();
    document.execCommand("copy");
    element.remove();
}

@Component
export default class App extends Vue {
    private search = "";
    private debouncedSearch!: (text: string) => void;

    private height = 300;

    private get filteredIcons() {
        if(!this.search) {
            return MDI_META;
        }

        const search = this.search.substr(0, 20);
        return fuse.search(search, {limit: 80}).map(r => r.item);
    }

    private get rows() {
        const bp = this.$vuetify.breakpoint;
        const size = bp.xsOnly ? 3
            : bp.smAndDown ? 4
                : 8;

        return chunk(this.filteredIcons, size);
    }

    private onResize() {
        this.height = window.innerHeight - 64;
    }

    private onSearch(text: string | null) {
        this.debouncedSearch(text || "");
    }

    private onClick(name: string) {
        copyTextToClipboard(`mdi-${name}`);
    }

    mounted(): void {
        this.debouncedSearch = debounce((text: string) => this.search = text, 200);
    }
}

</script>

<style lang="scss">

html {
    overflow-y: auto !important;
}

</style>
