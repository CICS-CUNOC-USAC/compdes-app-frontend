<template>
  <div>
    <!-- <header>
      <h1>My Application</h1>
    </header> -->
    <SidebarProvider>
      <!-- <AppSidebar /> -->
      <main class="w-full min-h-screen flex flex-col">
        <div
          class="flex py-2 px-3.5 z-50 justify-between gap-x-2 sticky top-0 bg-background/80 backdrop-blur"
        >
          <section class="flex items-center gap-x-2">
            <!-- <SidebarTrigger>
              <template #icon>
                <Icon name="lucide:menu" class="size-4" />
              </template>
            </SidebarTrigger> -->
            <NuxtLink to="/" class="inline-block uppercase font-medium text-sm text-foreground">
              <CompdesLogo
                class="size-4.5 inline-block mr-1 mb-0.5 fill-foreground"
              />
              Compdes</NuxtLink
            >
            <h2
              class="text-muted-foreground text-sm uppercase transition duration-300 ease-in-out flex items-center gap-2"
              :class="{
                'opacity-100 translate-y-0': hasScrolled,
                'opacity-0 translate-y-2': !hasScrolled,
              }"
            >
              <Icon
                name="lucide:chevron-right"
                class="size-4"
                v-if="$route.meta.title"
              />
              {{ $route.meta.title || "" }}
            </h2>
          </section>

          <section>
            <Dialog>
              <DialogTrigger as-child>
                <Button size="sm" variant="outline">
                  <Icon name="lucide:circle-help" class="size-4" />
                  Preguntas frecuentes
                </Button>
              </DialogTrigger>
              <DialogContent
                class="sm:max-w-[700px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
              >
                <DialogHeader class="p-6 pb-0">
                  <DialogTitle>Dudas frecuentes</DialogTitle>
                  <DialogDescription>
                    Tienes alguna duda sobre el evento? Aquí encontrarás
                    respuestas a las preguntas más comunes.
                  </DialogDescription>
                </DialogHeader>
                <div class="grid gap-4 py-4 overflow-y-auto">
                  <FaqContent />
                </div>
                <DialogFooter class="p-6 pt-0">
                  <DialogClose as-child>
                    <Button type="submit" size="sm">
                      <Icon name="lucide:x" class="size-4" />
                      Cerrar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        </div>
        <div class="flex-1">
          <NuxtPage />
        </div>
      </main>
    </SidebarProvider>

    <!-- <footer>
      <p>&copy; 2023 My Application</p>
    </footer> -->
  </div>
</template>
<script setup>
  import AppSidebar from "~/components/AppSidebar.vue";
  import SidebarProvider from "~/components/ui/sidebar/SidebarProvider.vue";
  import SidebarTrigger from "~/components/ui/sidebar/SidebarTrigger.vue";
  import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "~/components/ui/dialog";
  import { Button } from "~/components/ui/button";
  import FaqContent from "~/components/content/FaqContent.vue";
import CompdesLogo from "~/components/partials/CompdesLogo.vue";

  // test
  const hasScrolled = ref(false);
  onMounted(() => {
    window.addEventListener("scroll", () => {
      hasScrolled.value = window.scrollY > 100;
    });
  });
  onUnmounted(() => {
    window.removeEventListener("scroll", () => {
      hasScrolled.value = false;
    });
  });
</script>
<style scoped></style>
