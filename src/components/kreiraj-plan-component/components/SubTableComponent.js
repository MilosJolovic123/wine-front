import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { GridRowModes } from "@mui/x-data-grid";

const initialSubRows = [];

function EditToolbar(props) {
  const { setSubRows, setRowModesModel, nextId } = props;

  const handleClick = () => {
    const id = nextId();
    setSubRows((subRows) => [
      ...subRows,
      { idRepromaterijala: id, nazivEnoloskogAditiva: '', kolicina: 0, isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nazivEnoloskogAditiva' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Dodaj repromaterijal
      </Button>
    </GridToolbarContainer>
  );
}

function SubTableDialog({ open, onClose, rows, setRows, rowId }) {
  const [subRows, setSubRows] = React.useState(rows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  React.useEffect(() => {
    setSubRows(rows);
  }, [rows]);

  const getNextSubId = () => {
    return subRows.length ? Math.max(...subRows.map((row) => row.idRepromaterijala)) + 1 : 1;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    const newRows = subRows.filter((row) => row.idRepromaterijala !== id);
    const renumberedRows = newRows.map((row, index) => ({
      ...row,
      idRepromaterijala: index + 1, // Start numbering from 1
    }));
    setSubRows(renumberedRows);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: 'View', ignoreModifications: true },
    });

    const editedRow = subRows.find((row) => row.idRepromaterijala === id);
    if (editedRow.isNew) {
      setSubRows(subRows.filter((row) => row.idRepromaterijala !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setSubRows(subRows.map((row) => (row.idRepromaterijala === newRow.idRepromaterijala ? updatedRow : row)));
    return updatedRow;
  };

  const handleCloseAndSave = () => {
    setRows(subRows);
    onClose();
  };

  const columns = [
    { field: 'idRepromaterijala', headerName: 'ID Repromaterijala', flex: 0.3 },
    { type:'singleSelect',field: 'nazivEnoloskogAditiva', headerName: 'Naziv Enoloskog Aditiva', flex: 0.4, editable: true,valueOptions:['Kvasac','Sumpor dioksid','Kalijum bitartrat','Tanin','Šećer','Enzim','Glicerol'] },
    { field: 'kolicina', headerName: 'Količina', flex: 0.3, type: 'number', editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <IconButton key="save" onClick={handleSaveClick(id)}><SaveIcon /></IconButton>,
            <IconButton key="cancel" onClick={handleCancelClick(id)}><CancelIcon /></IconButton>,
          ];
        }

        return [
          <IconButton key="edit" onClick={handleEditClick(id)}><EditIcon /></IconButton>,
          <IconButton key="delete" onClick={handleDeleteClick(id)}><DeleteIcon /></IconButton>,
        ];
      },
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Repromaterijali za Stavku {rowId}</DialogTitle>
      <DialogContent>
        <DataGrid
          rows={subRows}
          columns={columns}
          editMode="row"
          getRowId={(row) => row.idRepromaterijala}
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setSubRows, setRowModesModel, nextId: getNextSubId },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAndSave}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SubTableDialog;