import { FC } from 'react';
import { PersonalityResult } from '@/types/quiz';
import { Button } from '@/components/common/Button';

interface ShareButtonsProps {
  result: PersonalityResult;
  quizId?: string;
}

export const ShareButtons: FC<ShareButtonsProps> = ({ result, quizId = 'quiz-1' }) => {
  const generateShareUrl = (): string => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      personalityType: result.personalityType,
      score: result.score.toString(),
      quiz: quizId,
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const handleCopyLink = (): void => {
    const url = generateShareUrl();
    void navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(() => {
        alert('Could not copy the link. Please copy it manually from the address bar.');
      });
  };

  const handleShareTwitter = (): void => {
    const url = generateShareUrl();
    const text = `I got ${result.personalityType} on the Personality Quiz! Score: ${result.score}/100`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  return (
    <div className="mt-8 flex flex-wrap gap-4 justify-center">
      <Button onClick={handleCopyLink} variant="primary">
        Copy Link
      </Button>
      <Button onClick={handleShareTwitter} variant="secondary">
        Share on Twitter
      </Button>
    </div>
  );
};
