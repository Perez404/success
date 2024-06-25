import React, { useEffect, useState } from 'react';
import { getGeniusKids, addGeniusKid } from '../api';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TableSortLabel, MenuItem, Select, FormControl, InputLabel, Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';

interface GeniusKid {
  id: string;
  fullName: string;
  birthDate: string;
  gender: 'мужской' | 'женский';
  achievements: 'школьный' | 'муниципальный' | 'региональный' | 'всероссийский';
  result: 'победитель' | 'призер' | 'участник';
  place: 'школа' | 'колледж';
  contact: string;
}

const GeniusKidsTable: React.FC = () => {
  const [geniusKids, setGeniusKids] = useState<GeniusKid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof GeniusKid, direction: 'asc' | 'desc' | undefined }>({ key: 'fullName', direction: undefined });
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [achievementsFilter, setAchievementsFilter] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<string>('');
  const [placeFilter, setPlaceFilter] = useState<string>('');
  const [contactFilter, setContactFilter] = useState<string>('');

  const [newKid, setNewKid] = useState<Omit<GeniusKid, 'id'>>({
    fullName: '',
    birthDate: '',
    gender: 'мужской',
    achievements: 'школьный',
    result: 'участник',
    place: 'школа',
    contact: ''
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGeniusKids();
        setGeniusKids(data);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSort = (key: keyof GeniusKid) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedKids = [...geniusKids].sort((a, b) => {
    if (sortConfig.direction === undefined) {
      return 0;
    }
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredKids = sortedKids.filter((kid) =>
    kid.fullName.toLowerCase().includes(search.toLowerCase()) &&
    (genderFilter === '' || kid.gender === genderFilter) &&
    (achievementsFilter === '' || kid.achievements === achievementsFilter) &&
    (resultFilter === '' || kid.result === resultFilter) &&
    (placeFilter === '' || kid.place === placeFilter) &&
    (contactFilter === '' || (contactFilter === 'gmail' && kid.contact.endsWith('@gmail.com')) || (contactFilter === 'yandex' && kid.contact.endsWith('@yandex.ru')))
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string | undefined; value: unknown; }>) => {
    const { name, value } = event.target as HTMLInputElement;
    setNewKid({
      ...newKid,
      [name]: value
    });
  };

  const handleSelectChange = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    const { name, value } = event.target;
    setNewKid({
      ...newKid,
      [name as keyof Omit<GeniusKid, 'id'>]: value as string
    });
  };

  const handleAddKid = async () => {
    try {
      const addedKid = await addGeniusKid(newKid);
      setGeniusKids([...geniusKids, addedKid]);
      setNewKid({
        fullName: '',
        birthDate: '',
        gender: 'мужской',
        achievements: 'школьный',
        result: 'участник',
        place: 'школа',
        contact: ''
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding kid:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <TextField
        label="Поиск по имени"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />
      <FormControl variant="outlined" style={{ minWidth: 120, marginRight: '20px', marginBottom: '20px' }}>
        <InputLabel id="gender-filter-label">Пол</InputLabel>
        <Select
          labelId="gender-filter-label"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value as string)}
          label="Пол"
        >
          <MenuItem value="">
            <em>Все</em>
          </MenuItem>
          <MenuItem value="мужской">мужской</MenuItem>
          <MenuItem value="женский">женский</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 120, marginRight: '20px', marginBottom: '20px' }}>
        <InputLabel id="place-filter-label">Место</InputLabel>
        <Select
          labelId="place-filter-label"
          value={placeFilter}
          onChange={(e) => setPlaceFilter(e.target.value as string)}
          label="Место"
        >
          <MenuItem value="">
            <em>Все</em>
          </MenuItem>
          <MenuItem value="школа">школа</MenuItem>
          <MenuItem value="колледж">колледж</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 160, marginRight: '20px', marginBottom: '20px' }}>
        <InputLabel id="achievements-filter-label">Достижения</InputLabel>
        <Select
          labelId="achievements-filter-label"
          value={achievementsFilter}
          onChange={(e) => setAchievementsFilter(e.target.value as string)}
          label="Достижения"
        >
          <MenuItem value="">
            <em>Все</em>
          </MenuItem>
          <MenuItem value="школьный">школьный</MenuItem>
          <MenuItem value="муниципальный">муниципальный</MenuItem>
          <MenuItem value="региональный">региональный</MenuItem>
          <MenuItem value="всероссийский">всероссийский</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: '20px' }}>
        <InputLabel id="result-filter-label">Результат</InputLabel>
        <Select
          labelId="result-filter-label"
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value as string)}
          label="Результат"
        >
          <MenuItem value="">
            <em>Все</em>
          </MenuItem>
          <MenuItem value="победитель">победитель</MenuItem>
          <MenuItem value="призер">призер</MenuItem>
          <MenuItem value="участник">участник</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: '20px' }}>
        <InputLabel id="contact-filter-label">Контакты</InputLabel>
        <Select
          labelId="contact-filter-label"
          value={contactFilter}
          onChange={(e) => setContactFilter(e.target.value as string)}
          label="Контакты"
        >
          <MenuItem value="">
            <em>Все</em>
          </MenuItem>
          <MenuItem value="gmail">Gmail</MenuItem>
          <MenuItem value="yandex">Yandex</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: '10px', marginLeft:'10px' }}>
        Добавить
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'fullName'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('fullName')}
                >
                  Имя
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'birthDate'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('birthDate')}
                >
                  Дата рождения
                </TableSortLabel>
              </TableCell>
              <TableCell>Пол</TableCell>
              <TableCell>Достижения</TableCell>
              <TableCell>Результат</TableCell>
              <TableCell>Место</TableCell>
              <TableCell>Контакт</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredKids.map((kid) => (
              <TableRow key={kid.id}>
                <TableCell>{kid.fullName}</TableCell>
                <TableCell>{kid.birthDate}</TableCell>
                <TableCell>{kid.gender}</TableCell>
                <TableCell>{kid.achievements}</TableCell>
                <TableCell>{kid.result}</TableCell>
                <TableCell>{kid.place}</TableCell>
                <TableCell>{kid.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Добавить нового ребенка</DialogTitle>
        <DialogContent>
          <TextField
            label="Имя"
            variant="outlined"
            name="fullName"
            value={newKid.fullName}
            onChange={handleInputChange}
            style={{ marginBottom: '20px' }}
            fullWidth
          />
          <TextField
            label="Дата рождения"
            variant="outlined"
            name="birthDate"
            value={newKid.birthDate}
            onChange={handleInputChange}
            style={{ marginBottom: '20px' }}
            fullWidth
          />
          <FormControl variant="outlined" style={{ marginBottom: '20px' }} fullWidth>
            <InputLabel>Пол</InputLabel>
            <Select
              value={newKid.gender}
              onChange={handleSelectChange}
              name="gender"
              label="Пол"
            >
              <MenuItem value="мужской">мужской</MenuItem>
              <MenuItem value="женский">женский</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ marginBottom: '20px' }} fullWidth>
            <InputLabel>Достижения</InputLabel>
            <Select
              value={newKid.achievements}
              onChange={handleSelectChange}
              name="achievements"
              label="Достижения"
            >
              <MenuItem value="школьный">школьный</MenuItem>
              <MenuItem value="муниципальный">муниципальный</MenuItem>
              <MenuItem value="региональный">региональный</MenuItem>
              <MenuItem value="всероссийский">всероссийский</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ marginBottom: '20px' }} fullWidth>
            <InputLabel>Результат</InputLabel>
            <Select
              value={newKid.result}
              onChange={handleSelectChange}
              name="result"
              label="Результат"
            >
              <MenuItem value="победитель">победитель</MenuItem>
              <MenuItem value="призер">призер</MenuItem>
              <MenuItem value="участник">участник</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ marginBottom: '20px' }} fullWidth>
            <InputLabel>Место</InputLabel>
            <Select
              value={newKid.place}
              onChange={handleSelectChange}
              name="place"
              label="Место"
            >
              <MenuItem value="школа">школа</MenuItem>
              <MenuItem value="колледж">колледж</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Контакт"
            variant="outlined"
            name="contact"
            value={newKid.contact}
            onChange={handleInputChange}
            style={{ marginBottom: '20px' }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleAddKid} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GeniusKidsTable;
