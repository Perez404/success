import React, { useEffect, useState } from 'react';
import { getGeniusKids } from '../api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TableSortLabel, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

interface GeniusKid {
  id: string;
  fullName: string;
  birthDate: string;
  gender: 'мужской' | 'женский';
  achievements: 'школьный' | 'муниципальный' | 'региональный' | 'всероссийский';
  result: 'победитель' | 'призер' | 'участник';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGeniusKids();
        console.log('Fetched Data:', data); // Проверка данных
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
    (resultFilter === '' || kid.result === resultFilter)
  );

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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Полное имя</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'birthDate'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('birthDate')}
                >
                  Дата рождения
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'gender'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('gender')}
                >
                  Пол
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
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'result'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('result')}
                >
                  Результат
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredKids.map((kid) => (
              <TableRow key={kid.id}>
                <TableCell>{kid.id}</TableCell>
                <TableCell>{kid.fullName}</TableCell>
                <TableCell>{kid.birthDate}</TableCell>
                <TableCell>{kid.gender}</TableCell>
                <TableCell>{kid.achievements}</TableCell>
                <TableCell>{kid.result}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GeniusKidsTable;
