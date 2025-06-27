<script setup lang="ts" generic="TData, TValue">
  import type { ColumnDef, SortingState } from "@tanstack/vue-table";
  import {
    FlexRender,
    getCoreRowModel,
    useVueTable,
  } from "@tanstack/vue-table";

  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import Button from "~/components/ui/button/Button.vue";

  const props = withDefaults(
    defineProps<{
      columns: ColumnDef<TData, TValue>[];
      data: TData[];
      totalElements?: number;
      totalPages?: number;
      sorting?: SortingState;
      enableSorting?: boolean;
      disablePagination?: boolean;
      paginationState?: {
        pageIndex: number;
        pageSize: number;
      };
    }>(),
    {
      paginationState: () => ({
        pageIndex: 0,
        pageSize: 10,
      }),
      sorting: () => [],
      enableSorting: true,
    },
  );

  const emit = defineEmits(["paginationChange", "sortChange"]);

  const table = useVueTable({
    get data() {
      return props.data;
    },
    // data: props.data,
    // get columns() {
    //   return props.columns;
    // },
    // data: props.data,
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    enableMultiSort: false,
    manualPagination: true,
    manualSorting: true,
    enableSorting: props.enableSorting,
    rowCount: props.totalElements ?? 0,
    pageCount: props.totalPages ?? -1,
    onPaginationChange: (updater) => emit("paginationChange", updater),
    onSortingChange: (updater) => emit("sortChange", updater),
    state: {
      get pagination() {
        return props.paginationState;
      },
      get sorting() {
        return props.sorting;
      },
    },
  });
</script>

<template>
  <div>
    <div
      class="flex justify-between items-center pb-2.5"
      v-if="!props.disablePagination"
    >
      <div>
        <span class="text-sm text-muted-foreground">
          Página
          <span class="text-foreground font-bold">{{
            table.getState().pagination.pageIndex + 1
          }}</span>
          de
          {{ table.getPageCount() }}
        </span>
        <span class="ml-4 text-sm text-muted-foreground">
          Total de registros: {{ table.getRowCount() }}
        </span>
      </div>

      <div class="flex gap-2">
        <Button
          class=""
          @click="table.previousPage()"
          variant="secondary"
          :disabled="!table.getCanPreviousPage()"
          size="sm"
        >
          <Icon name="lucide:chevron-left" />
          Anterior
        </Button>
        <Button
          class=""
          @click="table.nextPage()"
          variant="secondary"
          :disabled="!table.getCanNextPage()"
          size="sm"
        >
          <Icon name="lucide:chevron-right" />
          Siguiente
        </Button>
      </div>
    </div>
    <div class="border rounded-md overflow-hidden">
      <Table class="w-full">
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="bg-accent"
            >
              <div
                class="flex items-center gap-2 transition"
                :class="{
                  'select-none hover:text-foreground':
                    !header.column.getIsSorted(),
                  'text-foreground': header.column.getIsSorted(),
                  'cursor-pointer': header.column.getCanSort(),
                }"
                :style="{
                  width: header.getSize() !== 0 ? `${header.getSize()}px` : undefined
                }"
                @click="
                  () => {
                    if (header.column.getCanSort()) {
                      header.column.toggleSorting();
                    }
                  }
                "
              >
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <Icon
                  v-if="header.column.getIsSorted() === 'asc'"
                  name="lucide:arrow-up"
                  class="inline ml-1"
                />
                <Icon
                  v-else-if="header.column.getIsSorted() === 'desc'"
                  name="lucide:arrow-down"
                  class="inline ml-1"
                />
                <!-- you can omit the else-block if you don’t want any icon when unsorted -->
                <Icon
                  v-else-if="
                    !header.column.getIsSorted() && header.column.getCanSort()
                  "
                  name="lucide:chevrons-up-down"
                  class="inline ml-1 text-muted-foreground"
                />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="py-3"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                Sin registros disponibles
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <!-- <div class="flex justify-between items-center mt-2.5">
      <div>
        <span class="text-sm text-muted-foreground">
          Página <span class="text-foreground font-bold">{{ table.getState().pagination.pageIndex + 1 }}</span> de
          {{ table.getPageCount() }}
        </span>
        <span class="ml-4 text-sm text-muted-foreground">
          Total de registros: {{ table.getRowCount() }}
        </span>
      </div>

      <div class="flex  gap-2">
        <Button
          class=""
          @click="table.previousPage()"
          variant="secondary"
          :disabled="!table.getCanPreviousPage()"
          size="sm"
        >
          <Icon name="lucide:chevron-left" />
          Anterior
        </Button>
        <Button
          class=""
          @click="table.nextPage()"
          variant="secondary"
          :disabled="!table.getCanNextPage()"
          size="sm"
        >
          <Icon name="lucide:chevron-right" />
          Siguiente
        </Button>
      </div>
    </div> -->
  </div>
</template>
