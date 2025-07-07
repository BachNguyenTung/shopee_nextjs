import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Close } from '@mui/icons-material';

interface HeaderSuggestionProps {
  inputValue: string;
  searchHistory: string[];
  onSuggestionClick: (text: string) => void;
  onHistoryDelete: (item: string) => void;
}

const PAGE_SIZE = 10;

const HeaderSuggestion = ({
                            inputValue,
                            searchHistory,
                            onSuggestionClick,
                            onHistoryDelete,
                          }: HeaderSuggestionProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const listRef = useRef<HTMLUListElement>(null);

  const suggestions = useMemo(
    () =>
      searchHistory.filter((item) =>
        item.trim().toLowerCase().includes(inputValue.trim().toLowerCase())
      ),
    [inputValue, searchHistory]
  );

  // Reset visibleCount when inputValue or searchHistory changes
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [inputValue, searchHistory]);

  const handleScroll = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    if (list.scrollTop + list.clientHeight >= list.scrollHeight - 5) {
      // Near bottom, load more
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, suggestions.length));
    }
  }, [suggestions.length]);

  return (
    <div
      className="header__history-list"
    >
      <p className="header__history-title">
        {suggestions.length === 0 && inputValue !== ''
          ? `Không tìm thấy gợi ý với từ khóa '${inputValue}'`
          : 'Lịch Sử Tìm Kiếm'}
      </p>
      <ul className='max-h-[300px] overflow-y-auto' ref={listRef} onScroll={handleScroll}>
        {suggestions.slice(0, visibleCount).map((item, index) => (
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
        {visibleCount < suggestions.length && (
          <li className="header__history-loading" style={{ textAlign: 'center', padding: 8 }}>
            Đang tải thêm...
          </li>
        )}
      </ul>
    </div>
  );
};

export default HeaderSuggestion;
