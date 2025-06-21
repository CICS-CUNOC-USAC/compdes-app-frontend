<script setup lang="ts" generic="TData, TValue">
  import type { ColumnDef } from "@tanstack/vue-table";
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

  const props = defineProps<{
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    totalElements?: number;
    totalPages?: number;
    paginationState?: {
      pageIndex: number;
      pageSize: number;
    };
  }>();

  const emit = defineEmits(["paginationChange"]);

  const table = useVueTable({
    get data() {
      return props.data;
    },
    get columns() {
      return props.columns;
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: props.totalElements ?? 0,
    pageCount: props.totalPages ?? -1,
    onPaginationChange: (updater) => emit("paginationChange", updater),
    state: {
      pagination: props.paginationState ?? {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });
</script>

<template>
  <div>
    <div class="flex justify-between items-center pb-2.5">
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
      <Table>
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
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
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
