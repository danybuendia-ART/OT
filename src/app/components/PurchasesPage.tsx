import { useState, useEffect } from 'react';
import { getMaterials, getProjects, addMaterial, updateMaterial, deleteMaterial } from '../lib/storage';
import { Material, Project } from '../lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, ShoppingCart, Edit2, Trash2, Package, Clock, Truck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function PurchasesPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [newMaterial, setNewMaterial] = useState({
    projectId: '',
    name: '',
    description: '',
    quantity: 1,
    unit: '',
    status: 'en espera' as Material['status'],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMaterials(getMaterials());
    setProjects(getProjects());
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.projectId) {
      toast.error('Selecciona un proyecto');
      return;
    }
    addMaterial(newMaterial);
    setIsDialogOpen(false);
    setNewMaterial({
      projectId: '',
      name: '',
      description: '',
      quantity: 1,
      unit: '',
      status: 'en espera',
    });
    loadData();
    toast.success('Material agregado exitosamente');
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;

    updateMaterial(editingMaterial.id, {
      name: editingMaterial.name,
      description: editingMaterial.description,
      quantity: editingMaterial.quantity,
      unit: editingMaterial.unit,
      status: editingMaterial.status,
    });

    setIsEditDialogOpen(false);
    setEditingMaterial(null);
    loadData();
    toast.success('Material actualizado exitosamente');
  };

  const handleDeleteMaterial = (material: Material) => {
    if (material.status === 'en camino' || material.status === 'entregado') {
      toast.error('No puedes eliminar materiales en camino o entregados');
      return;
    }

    if (confirm('¿Estás seguro de eliminar este material?')) {
      deleteMaterial(material.id);
      loadData();
      toast.success('Material eliminado');
    }
  };

  const getStatusIcon = (status: Material['status']) => {
    switch (status) {
      case 'en espera':
        return <Clock className="w-4 h-4" />;
      case 'en camino':
        return <Truck className="w-4 h-4" />;
      case 'entregado':
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Material['status']) => {
    switch (status) {
      case 'en espera':
        return 'default';
      case 'en camino':
        return 'default';
      case 'entregado':
        return 'default';
    }
  };

  const canEdit = (material: Material) => {
    return material.status !== 'en camino' && material.status !== 'entregado';
  };

  const filteredMaterials = selectedProject === 'all'
    ? materials
    : materials.filter(m => m.projectId === selectedProject);

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Desconocido';
  };

  const materialsByStatus = {
    'en espera': filteredMaterials.filter(m => m.status === 'en espera').length,
    'en camino': filteredMaterials.filter(m => m.status === 'en camino').length,
    'entregado': filteredMaterials.filter(m => m.status === 'entregado').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold">Compras y Materiales</h2>
          <p className="text-gray-500 mt-1">Gestiona los materiales requeridos para cada proyecto</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Material</DialogTitle>
              <DialogDescription>
                Registra un nuevo material requerido para un proyecto
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateMaterial} className="space-y-4">
              <div>
                <Label htmlFor="project">Proyecto</Label>
                <Select
                  value={newMaterial.projectId}
                  onValueChange={(value) => setNewMaterial({ ...newMaterial, projectId: value })}
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Selecciona un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Nombre del Material</Label>
                <Input
                  id="name"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newMaterial.quantity}
                    onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unidad</Label>
                  <Input
                    id="unit"
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    placeholder="ej. piezas, m³, kg"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={newMaterial.status}
                  onValueChange={(value) => setNewMaterial({ ...newMaterial, status: value as Material['status'] })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en espera">En espera</SelectItem>
                    <SelectItem value="en camino">En camino</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Agregar Material</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Espera</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{materialsByStatus['en espera']}</div>
            <p className="text-xs text-gray-500 mt-1">Materiales pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Camino</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{materialsByStatus['en camino']}</div>
            <p className="text-xs text-gray-500 mt-1">En tránsito</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{materialsByStatus['entregado']}</div>
            <p className="text-xs text-gray-500 mt-1">Completados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter by project */}
      <div className="flex items-center gap-4">
        <Label htmlFor="filter-project">Filtrar por proyecto:</Label>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger id="filter-project" className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los proyectos</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Materials list */}
      <div className="space-y-3">
        {filteredMaterials.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No hay materiales registrados</p>
            </CardContent>
          </Card>
        ) : (
          filteredMaterials.map((material) => (
            <Card key={material.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold">{material.name}</h3>
                      <Badge variant={getStatusColor(material.status)} className="gap-1">
                        {getStatusIcon(material.status)}
                        {material.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>
                        <strong>Cantidad:</strong> {material.quantity} {material.unit}
                      </span>
                      <span>
                        <strong>Proyecto:</strong> {getProjectName(material.projectId)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Actualizado: {material.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMaterial(material)}
                      disabled={!canEdit(material)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMaterial(material)}
                      disabled={!canEdit(material)}
                      className={!canEdit(material) ? '' : 'hover:bg-red-50 hover:text-red-600 hover:border-red-200'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Material</DialogTitle>
            <DialogDescription>
              Actualiza la información del material
            </DialogDescription>
          </DialogHeader>
          {editingMaterial && (
            <form onSubmit={handleUpdateMaterial} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre del Material</Label>
                <Input
                  id="edit-name"
                  value={editingMaterial.name}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={editingMaterial.description}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-quantity">Cantidad</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="1"
                    value={editingMaterial.quantity}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, quantity: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-unit">Unidad</Label>
                  <Input
                    id="edit-unit"
                    value={editingMaterial.unit}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, unit: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={editingMaterial.status}
                  onValueChange={(value) => setEditingMaterial({ ...editingMaterial, status: value as Material['status'] })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en espera">En espera</SelectItem>
                    <SelectItem value="en camino">En camino</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Actualizar Material</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
