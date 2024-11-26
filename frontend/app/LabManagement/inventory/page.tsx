"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  sku: string;
  lastRestocked: string;
};

const initialInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Widget A",
    category: "Electronics",
    quantity: 100,
    unit: "pcs",
    price: 9.99,
    sku: "WA-001",
    lastRestocked: "2024-03-15T10:30:00",
  },
  {
    id: 2,
    name: "Gadget B",
    category: "Electronics",
    quantity: 50,
    unit: "pcs",
    price: 24.99,
    sku: "GB-002",
    lastRestocked: "2024-03-10T14:45:00",
  },
  {
    id: 3,
    name: "Tool C",
    category: "Hardware",
    quantity: 200,
    unit: "pcs",
    price: 14.5,
    sku: "TC-003",
    lastRestocked: "2024-03-12T09:15:00",
  },
];

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredInventory = inventory.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().startsWith(filter.toLowerCase())
    )
  );

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      setInventory(
        inventory.map((item) =>
          item.id === editingItem.id ? editingItem : item
        )
      );
      setIsEditDialogOpen(false);
    }
  };

  const handleAddStock = (item: InventoryItem) => {
    setEditingItem(item);
    setIsAddStockDialogOpen(true);
  };

  const handleSaveAddStock = () => {
    if (editingItem) {
      setInventory(
        inventory.map((item) =>
          item.id === editingItem.id ? editingItem : item
        )
      );
      setIsAddStockDialogOpen(false);
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>
            Manage available samples and add new test result to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-1 mr-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="pl-8"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          </div>
          <ScrollArea className="h-min[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.quantity > 50 ? "default" : "destructive"}
                      >
                        {item.quantity} {item.unit}
                      </Badge>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(item.lastRestocked).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button size="sm" onClick={() => handleAddStock(item)}>
                          <Package className="mr-2 h-4 w-4" />
                          Add Stock
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={editingItem.category}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, category: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Unit
                </Label>
                <Input
                  id="unit"
                  value={editingItem.unit}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, unit: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <Button onClick={handleSaveEdit}>Save Changes</Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddStockDialogOpen}
        onOpenChange={setIsAddStockDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <p>
                Current stock for {editingItem.name}: {editingItem.quantity}{" "}
                {editingItem.unit}
              </p>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="addQuantity" className="text-right">
                  Add Quantity
                </Label>
                <Input
                  id="addQuantity"
                  type="number"
                  placeholder="Enter quantity to add"
                  onChange={(e) => {
                    const addQuantity = parseInt(e.target.value, 10);
                    setEditingItem({
                      ...editingItem,
                      quantity:
                        editingItem.quantity +
                        (isNaN(addQuantity) ? 0 : addQuantity),
                      lastRestocked: new Date().toISOString(),
                    });
                  }}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <Button onClick={handleSaveAddStock}>Update Stock</Button>
        </DialogContent>
      </Dialog>
    </main>
  );
}
