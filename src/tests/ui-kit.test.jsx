import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchScoreRing } from '../components/ui/MatchScoreRing';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { formatCurrency, formatDate, formatMatchScore } from '../utils/formatters';

describe('Shared UI Kit Components', () => {
  describe('MatchScoreRing', () => {
    it('renders correct score percentage text and ARIA attributes', () => {
      render(<MatchScoreRing score={96} size="md" showSublabel sublabel="Match" />);
      expect(screen.getByText('96%')).toBeInTheDocument();
      expect(screen.getByText('Match')).toBeInTheDocument();
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '96');
    });

    it('handles boundary score values 0 and 100', () => {
      const { rerender } = render(<MatchScoreRing score={0} />);
      expect(screen.getByText('0%')).toBeInTheDocument();

      rerender(<MatchScoreRing score={100} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Badge', () => {
    it('renders with children text and semantic styles', () => {
      render(<Badge variant="verified">ยืนยันตัวตนแล้ว</Badge>);
      expect(screen.getByText('ยืนยันตัวตนแล้ว')).toBeInTheDocument();
    });

    it('renders match variant correctly', () => {
      render(<Badge variant="match">Best Match</Badge>);
      expect(screen.getByText('Best Match')).toBeInTheDocument();
    });
  });

  describe('Button', () => {
    it('renders button with label and responds to click event', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>คลิกที่นี่</Button>);

      const btn = screen.getByRole('button', { name: 'คลิกที่นี่' });
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables button and displays loading spinner when loading is true', () => {
      const handleClick = vi.fn();
      render(
        <Button loading onClick={handleClick}>
          กำลังโหลด
        </Button>
      );

      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Card', () => {
    it('renders CardHeader, CardTitle, and CardContent', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>หัวข้อการ์ด</CardTitle>
          </CardHeader>
          <CardContent>
            <p>เนื้อหาภายในการ์ด</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('หัวข้อการ์ด')).toBeInTheDocument();
      expect(screen.getByText('เนื้อหาภายในการ์ด')).toBeInTheDocument();
    });
  });

  describe('Modal', () => {
    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={() => {}} title="ทดสอบ Modal">
          <p>เนื้อหา</p>
        </Modal>
      );
      expect(screen.queryByText('ทดสอบ Modal')).not.toBeInTheDocument();
    });

    it('renders content and closes on close button click when isOpen is true', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="หน้าต่างยืนยัน">
          <p>ยืนยันการทำรายการ</p>
        </Modal>
      );

      expect(screen.getByText('หน้าต่างยืนยัน')).toBeInTheDocument();
      expect(screen.getByText('ยืนยันการทำรายการ')).toBeInTheDocument();

      const closeBtn = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Formatters Utility', () => {
    it('formats currency correctly in Thai and English', () => {
      expect(formatCurrency(450, 'th', { showUnit: true, unit: 'hour' })).toBe('฿450 / ชม.');
      expect(formatCurrency(450, 'en', { showUnit: true, unit: 'hour' })).toBe('฿450/hr');
      expect(formatCurrency(1500, 'th')).toBe('฿1,500');
    });

    it('evaluates match score thresholds', () => {
      expect(formatMatchScore(96).tier).toBe('excellent');
      expect(formatMatchScore(96).hexColor).toBe('#10B981');
      expect(formatMatchScore(88).tier).toBe('great');
      expect(formatMatchScore(88).hexColor).toBe('#0EA5E9');
      expect(formatMatchScore(76).tier).toBe('good');
      expect(formatMatchScore(76).hexColor).toBe('#F59E0B');
    });

    it('formats dates in Thai Buddhist Era and Gregorian', () => {
      const testDate = '2026-08-26';
      const formattedTh = formatDate(testDate, 'th', 'medium');
      expect(formattedTh).toContain('2569'); // 2026 + 543 = 2569
      expect(formattedTh).toContain('ส.ค.');

      const formattedEn = formatDate(testDate, 'en', 'medium');
      expect(formattedEn).toContain('2026');
      expect(formattedEn).toContain('Aug');
    });
  });
});
