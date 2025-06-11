<template>
  <div>
    <!-- <header>
      <h1>My Application</h1>
    </header> -->
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full min-h-screen flex flex-col">
        <div
          class="flex py-2 px-3.5 z-50 w-full justify-between gap-x-2 sticky top-0 bg-background/80 backdrop-blur"
        >
          <section class="flex items-center gap-x-2">
            <SidebarTrigger>
              <template #icon>
                <Icon name="lucide:menu" class="size-4" />
              </template>
            </SidebarTrigger>
            <h1 class="inline-block uppercase font-medium text-sm">Compdes</h1>
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
                  <!-- <div class="flex flex-col justify-between h-[300dvh]">
                    <p>
                      This is some placeholder content to show the scrolling
                      behavior for modals. We use repeated line breaks to
                      demonstrate how content can exceed minimum inner height,
                      thereby showing inner scrolling. When content becomes
                      longer than the predefined max-height of modal, content
                      will be cropped and scrollable within the modal.
                    </p>

                    <p>
                      This content should appear at the bottom after you scroll.
                    </p>
                  </div> -->
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

            <!-- <Button size="sm" variant="outline">
              <Icon name="lucide:circle-help" class="size-4" />
              Preguntas frecuentes
            </Button> -->
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
</script>
<style scoped></style>
