import React, { useEffect, useState } from 'react';
import { getGeniusKids, addGeniusKid, deleteGeniusKid } from '../api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TableSortLabel, MenuItem, Select, FormControl, InputLabel, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface GeniusKid {
  id: string;
  fullName: string;
  birthDate: string;
  gender: 'мужской' | 'женский';
  achievements: 'школьный' | 'муниципальный' | 'региональный' | 'всероссийский';
  result: 'победитель' | 'призер' | 'участник';
  place: 'школа' | 'колледж';
  contact: string;
  age: number;
  contest: 'Творческий конкурс' | 'Литературный конкурс';
  contestYear: '2019-2020' | '2020-2021';
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
  const [ageFilter, setAgeFilter] = useState<number | null>(null);
  const [contestFilter, setContestFilter] = useState<string>('');
  const [contestYearFilter, setContestYearFilter] = useState<string>('');

  const [newKid, setNewKid] = useState<Omit<GeniusKid, 'id'>>({
    fullName: '',
    birthDate: '',
    gender: 'мужской',
    achievements: 'школьный',
    result: 'участник',
    place: 'школа',
    contact: '',
    age: 0,
    contest: 'Творческий конкурс',
    contestYear: '2019-2020'
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
    (contactFilter === '' || (contactFilter === 'gmail' && kid.contact.endsWith('@gmail.com')) || (contactFilter === 'yandex' && kid.contact.endsWith('@yandex.ru'))) &&
    (ageFilter === null || kid.age === ageFilter) &&
    (contestFilter === '' || kid.contest === contestFilter) &&
    (contestYearFilter === '' || kid.contestYear === contestYearFilter)
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
        contact: '',
        age: 0,
        contest: 'Творческий конкурс',
        contestYear: '2019-2020'
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding kid:', error);
    }
  };

  const handleDeleteKid = async (id: string) => {
    try {
      await deleteGeniusKid(id);
      setGeniusKids(geniusKids.filter(kid => kid.id !== id));
    } catch (error) {
      console.error('Error deleting kid:', error);
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
      <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: '20px' }}>
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
      <FormControl variant="outlined" style={{ minWidth: 50, maxWidth: 100, marginBottom: '20px' }}>
        <TextField
          label="Возраст"
          type="number"
          value={ageFilter !== null ? ageFilter : ''}
          onChange={(e) => setAgeFilter(e.target.value === '' ? null : parseInt(e.target.value))}
          variant="outlined"
        />
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: '20px' }}>
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
      <FormControl variant="outlined" style={{ minWidth: 160, marginBottom: '20px' }}>
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
      <FormControl variant="outlined" style={{ minWidth: 160, marginBottom: '20px' }}>
        <InputLabel id="contest-filter-label">Конкурс</InputLabel>
        <Select
          labelId="contest-filter-label"
          value={contestFilter}
          onChange={(e) => setContestFilter(e.target.value as string)}
          label="Конкурс"
        >
          <MenuItem value="">
            <em>Все</em>
          </MenuItem>
          <MenuItem value="Творческий конкурс">Творческий конкурс</MenuItem>
          <MenuItem value="Литературный конкурс">Литературный конкурс</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 160, marginBottom: '20px' }}>
        <InputLabel id="contest-year-filter-label">Год конкурса</InputLabel>
        <Select
          labelId="contest-year-filter-label"
          value={contestYearFilter}
          onChange={(e) => setContestYearFilter(e.target.value as string)}
          label="Год конкурса"
        >
          <MenuItem value="">
            <em>Все</em>
          </MenuItem>
          <MenuItem value="2019-2020">2019-2020</MenuItem>
          <MenuItem value="2020-2021">2020-2021</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 160, marginBottom: '20px' }}>
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
      <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ minWidth: 80,  marginTop: '10px' }} >
        Добавить
      </Button>
      <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'fullName'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('fullName')}
                >
                  ФИО
                </TableSortLabel>
              </TableCell>
              <TableCell>Дата рождения</TableCell>
              <TableCell>Пол</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'age'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('age')}
                >
                  Возраст
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'place'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('place')}
                >
                  Место
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'achievements'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('achievements')}
                >
                  Достижения
                </TableSortLabel>
              </TableCell>
              <TableCell>Конкурс</TableCell>
              <TableCell>Год конкурса</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'result'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('result')}
                >
                  Результат
                </TableSortLabel>
              </TableCell>

              <TableCell>Контакт</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {filteredKids.map((kid) => (
              <TableRow key={kid.id}>
                <TableCell>{kid.fullName}</TableCell>
                <TableCell>{kid.birthDate}</TableCell>
                <TableCell>{kid.gender}</TableCell>
                <TableCell>{kid.age}</TableCell>
                <TableCell>{kid.place}</TableCell>
                <TableCell>{kid.achievements}</TableCell>
                <TableCell>{kid.contest}</TableCell>
                <TableCell>{kid.contestYear}</TableCell>
                <TableCell>{kid.result}</TableCell>
                <TableCell>{kid.contact}</TableCell>
                <TableCell>
                  <IconButton aria-label="delete" onClick={() => handleDeleteKid(kid.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Добавить участника</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="fullName"
            name="fullName"
            label="ФИО"
            type="text"
            fullWidth
            value={newKid.fullName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="birthDate"
            name="birthDate"
            label="Дата рождения"
            type="string"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            value={newKid.birthDate}
            onChange={handleInputChange}
          />
          <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel id="gender-label">Пол</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={newKid.gender}
              onChange={handleSelectChange}
              label="Пол"
            >
              <MenuItem value="мужской">мужской</MenuItem>
              <MenuItem value="женский">женский</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="age"
            name="age"
            label="Возраст"
            type="number"
            fullWidth
            value={newKid.age}
            onChange={handleInputChange}
          />
                    <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel id="place-label">Место</InputLabel>
            <Select
              labelId="place-label"
              id="place"
              name="place"
              value={newKid.place}
              onChange={handleSelectChange}
              label="Место"
            >
              <MenuItem value="школа">школа</MenuItem>
              <MenuItem value="колледж">колледж</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel id="achievements-label">Достижения</InputLabel>
            <Select
              labelId="achievements-label"
              id="achievements"
              name="achievements"
              value={newKid.achievements}
              onChange={handleSelectChange}
              label="Достижения"
            >
              <MenuItem value="школьный">школьный</MenuItem>
              <MenuItem value="муниципальный">муниципальный</MenuItem>
              <MenuItem value="региональный">региональный</MenuItem>
              <MenuItem value="всероссийский">всероссийский</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel id="contest-label">Конкурс</InputLabel>
            <Select
              labelId="contest-label"
              id="contest"
              name="contest"
              value={newKid.contest}
              onChange={handleSelectChange}
              label="Конкурс"
            >
              <MenuItem value="Творческий конкурс">Творческий конкурс</MenuItem>
              <MenuItem value="Литературный конкурс">Литературный конкурс</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel id="contestYear-label">Год конкурса</InputLabel>
            <Select
              labelId="contestYear-label"
              id="contestYear"
              name="contestYear"
              value={newKid.contestYear}
              onChange={handleSelectChange}
              label="Год конкурса"
            >
              <MenuItem value="2019-2020">2019-2020</MenuItem>
              <MenuItem value="2020-2021">2020-2021</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel id="result-label">Результат</InputLabel>
            <Select
              labelId="result-label"
              id="result"
              name="result"
              value={newKid.result}
              onChange={handleSelectChange}
              label="Результат"
            >
              <MenuItem value="победитель">победитель</MenuItem>
              <MenuItem value="призер">призер</MenuItem>
              <MenuItem value="участник">участник</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="contact"
            name="contact"
            label="Контакт"
            type="email"
            fullWidth
            value={newKid.contact}
            onChange={handleInputChange}
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
