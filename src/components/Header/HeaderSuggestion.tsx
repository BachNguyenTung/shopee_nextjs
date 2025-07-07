import React, { useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import { Close } from '@mui/icons-material';

interface HeaderSuggestionProps {
  inputValue: string;
  searchHistory: string[];
  onSuggestionClick: (text: string) => void;
  onHistoryDelete: (item: string) => void;
}

const HeaderSuggestion = ({
                            inputValue,
                            searchHistory,
                            onSuggestionClick,
                            onHistoryDelete,
                          }: HeaderSuggestionProps) => {
  const suggestions = useMemo(
    () =>
      searchHistory.filter((item) =>
        item.trim().toLowerCase().includes(inputValue.trim().toLowerCase())
      ),
    [inputValue, searchHistory]
  );

  return (
    <ul className="header__history-list">
      <li className="header__history-title">
        {suggestions.length === 0
          ? `Không tìm thấy gợi ý với từ khóa '${inputValue}'`
          : 'Lịch Sử Tìm Kiếm'}
      </li>
      {suggestions.map((item, index) => (
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            '&:hover': {
              backgroundColor: 'var(--lighter-grey-color)',
            },
          }}
          key={index}
        >
          <li
            onClick={() => onSuggestionClick(item)}
            className="header__history-item"
          >
            <a className="header__history-link">{item}</a>
          </li>
          <Box
            sx={{
              marginRight: '0.6rem',
              '& :hover': { color: 'var(--primary-color)' },
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Close onClick={() => onHistoryDelete(item)} />
          </Box>
        </Stack>
      ))}
    </ul>
  );
};

export default HeaderSuggestion;
