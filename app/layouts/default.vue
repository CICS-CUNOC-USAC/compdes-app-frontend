<template>
  <div>
    <!-- <header>
      <h1>My Application</h1>
    </header> -->
    <SidebarProvider>
      <AppSidebar />
      <main>
        <div class="flex flex-row mb-4 p-2">
          <SidebarTrigger />
          <h1>Compdes</h1>
        </div>
        <NuxtPage />
      </main>
    </SidebarProvider>
    <Drawer>
      <DrawerTrigger as-child
        class="fixed bottom-0 hover:-translate-y-2 transition right-0 py-3 border-t border-neutral-200 w-full lg:w-1/2">
        <button class="">Preguntas frecuentes</button>
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto w-full max-w-lg overflow-auto pb-6">
          <DrawerHeader class="sticky top-0 bg-white">
            <DrawerTitle class="flex justify-between">
              Preguntas frecuentes
              <DrawerClose as-child>
                <Button variant="ghost" size="icon">
                  <Icon name="lucide:x" />
                </Button>
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>
          <div class="p-4 pb-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla
            officia iure neque fugiat aliquam eos ab provident ducimus.
            Assumenda dolore quas tempora adipisci a provident sapiente debitis
            aspernatur aliquid animi.
          </div>
          <div class="p-4 pb-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla
            officia iure neque fugiat aliquam eos ab provident ducimus.
            Assumenda dolore quas tempora adipisci a provident sapiente debitis
            aspernatur aliquid animi.
          </div>
          <div class="p-4 pb-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla
            officia iure neque fugiat aliquam eos ab provident ducimus.
            Assumenda dolore quas tempora adipisci a provident sapiente debitis
            aspernatur aliquid animi.
          </div>
          <div class="p-4 pb-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla
            officia iure neque fugiat aliquam eos ab provident ducimus.
            Assumenda dolore quas tempora adipisci a provident sapiente debitis
            aspernatur aliquid animi.
          </div>
          <div class="p-4 pb-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla
            officia iure neque fugiat aliquam eos ab provident ducimus.
            Assumenda dolore quas tempora adipisci a provident sapiente debitis
            aspernatur aliquid animi.
          </div>
          <div class="p-4 pb-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla
            officia iure neque fugiat aliquam eos ab provident ducimus.
            Assumenda dolore quas tempora adipisci a provident sapiente debitis
            aspernatur aliquid animi.
          </div>
          <div class="p-4 pb-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla
            officia iure neque fugiat aliquam eos ab provident ducimus.
            Assumenda dolore quas tempora adipisci a provident sapiente debitis
            aspernatur aliquid animi.
          </div>
          <div class="p-4 pb-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla
            officia iure neque fugiat aliquam eos ab provident ducimus.
            Assumenda dolore quas tempora adipisci a provident sapiente debitis
            aspernatur aliquid animi.
          </div>
        </div>
      </DrawerContent>
    </Drawer>
    <!-- <footer>
      <p>&copy; 2023 My Application</p>
    </footer> -->
  </div>
</template>
<script setup>
import AppSidebar from '~/components/AppSidebar.vue';
import SidebarProvider from '~/components/ui/sidebar/SidebarProvider.vue';
import SidebarTrigger from '~/components/ui/sidebar/SidebarTrigger.vue';

</script>
<style scoped></style>
