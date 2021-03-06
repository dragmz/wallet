import styled from "styled-components";

import Button from "@popup/components/common/Button";
import Text from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/common/TopComponent";
import Icon, { IconNames } from "@popup/components/common/Icon";
import { withNavBar } from "@popup/components/common/NavBar";

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--s-24);
  padding-bottom: var(--s-48);
`;
const ContentContainer = styled.div`
  margin-bottom: var(--s-10);
`;
const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s-24) 0;
`;

export type EmptyCredentialsProps = {
  onNext: () => void;
};

function EmptyCredentials(props: EmptyCredentialsProps) {
  const { onNext } = props;

  return (
    <TopComponent>
      <IconContainer>
        <Icon name={IconNames.ROBOT} />
      </IconContainer>
      <ContentContainer>
        <Title>You haven’t issued a credential yet.</Title>
        <Text>
          <br />
        </Text>
        <Text>
          You can only issue a credential through your Fractal dashboard. The
          button below will redirect you to Fractal.
        </Text>
      </ContentContainer>
      <ActionContainer>
        <Button onClick={onNext}>Go to Fractal</Button>
      </ActionContainer>
    </TopComponent>
  );
}

export default withNavBar(EmptyCredentials);
